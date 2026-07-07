const state = {
  cards: [],
  filtered: [],
  index: 0,
  flipped: false,
  summary: null,
};

const $ = (id) => document.getElementById(id);
const cardEl = $('card');

function statusLabel(value) {
  if (value === 'O') return '안다 O';
  if (value === 'X') return '모른다 X';
  return '미학습';
}

function setMessage(text, isError = false) {
  const el = $('message');
  el.textContent = text;
  el.style.color = isError ? '#fb7185' : '#aab6cf';
}

function parseRelated(text) {
  const matches = [...(text || '').matchAll(/\[\[([^\]]+)\]\]/g)].map((m) => m[1]);
  if (matches.length) return matches;
  return (text || '').split(',').map((x) => x.trim()).filter(Boolean);
}

async function loadCards() {
  const res = await fetch('/api/cards');
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  state.cards = data.cards;
  state.summary = data.summary;
  buildCategoryOptions(data.summary.categories || []);
  applyFilters();
  renderStats(data.summary);
  $('csvPath').textContent = data.summary.csv_path;
}

function buildCategoryOptions(categories) {
  const current = $('categorySelect').value;
  $('categorySelect').innerHTML = '<option value="">전체</option>' +
    categories.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  $('categorySelect').value = current;
}

function renderStats(summary) {
  $('statTotal').textContent = summary.total;
  $('statKnown').textContent = summary.known;
  $('statUnknown').textContent = summary.unknown;
  $('statUnreviewed').textContent = summary.unreviewed;
}

function applyFilters(keepCurrentId = null) {
  const query = $('searchInput').value.trim().toLowerCase();
  const category = $('categorySelect').value;
  const status = $('statusSelect').value;
  state.filtered = state.cards.filter((c) => {
    const haystack = [c.id, c.term, c.english, c.category, c.definition, c.detailed_explanation, c.related_concepts, c.exam_note].join(' ').toLowerCase();
    const statusOk = !status || (status === 'unreviewed' ? !c.known_status : c.known_status === status);
    return (!query || haystack.includes(query)) && (!category || c.category === category) && statusOk;
  });
  if (keepCurrentId) {
    const found = state.filtered.findIndex((c) => c.id === keepCurrentId);
    state.index = found >= 0 ? found : Math.min(state.index, Math.max(0, state.filtered.length - 1));
  } else {
    state.index = Math.min(state.index, Math.max(0, state.filtered.length - 1));
  }
  state.flipped = false;
  renderCard();
}

function renderCard() {
  cardEl.classList.toggle('flipped', state.flipped);
  const total = state.filtered.length;
  $('positionText').textContent = total ? `${state.index + 1} / ${total}` : '0 / 0';
  const filters = [];
  if ($('searchInput').value.trim()) filters.push(`검색: ${$('searchInput').value.trim()}`);
  if ($('categorySelect').value) filters.push(`분야: ${$('categorySelect').value}`);
  if ($('statusSelect').value) filters.push(`상태: ${$('statusSelect').selectedOptions[0].textContent}`);
  $('filterText').textContent = filters.join(' · ') || '필터 없음';

  if (!total) {
    $('frontTerm').textContent = '카드 없음';
    $('frontEnglish').textContent = '필터 조건을 바꿔주세요.';
    $('frontCategory').textContent = '-';
    $('frontStatus').textContent = '-';
    return;
  }

  const c = state.filtered[state.index];
  $('frontCategory').textContent = c.category || '-';
  $('frontStatus').textContent = statusLabel(c.known_status);
  $('frontStatus').className = `badge status ${c.known_status === 'O' ? 'o' : c.known_status === 'X' ? 'x' : ''}`;
  $('frontTerm').textContent = c.term;
  $('frontEnglish').textContent = c.english || '';

  $('backCategory').textContent = c.category || '-';
  $('backId').textContent = c.id;
  $('backTerm').textContent = `${c.term}${c.english ? ' / ' + c.english : ''}`;
  $('definition').textContent = c.definition || '';
  $('detail').textContent = c.detailed_explanation || '';
  $('sources').textContent = c.source_files || '';
  $('examNote').textContent = c.exam_note || '';
  const related = parseRelated(c.related_concepts);
  $('related').innerHTML = related.map((r) => `<button class="chip" type="button" data-term="${escapeHtml(r)}">${escapeHtml(r)}</button>`).join('') || '<span class="muted">없음</span>';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function move(delta) {
  if (!state.filtered.length) return;
  state.index = (state.index + delta + state.filtered.length) % state.filtered.length;
  state.flipped = false;
  renderCard();
}

function randomCard() {
  if (!state.filtered.length) return;
  state.index = Math.floor(Math.random() * state.filtered.length);
  state.flipped = false;
  renderCard();
}

async function mark(status) {
  if (!state.filtered.length) return;
  const current = state.filtered[state.index];
  setMessage('CSV 저장 중...');
  const res = await fetch(`/api/cards/${encodeURIComponent(current.id)}/mark`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({known_status: status}),
  });
  if (!res.ok) {
    setMessage(`저장 실패: ${await res.text()}`, true);
    return;
  }
  const data = await res.json();
  const idx = state.cards.findIndex((c) => c.id === current.id);
  if (idx >= 0) state.cards[idx] = data.card;
  renderStats(data.summary);
  applyFilters(data.card.id);
  setMessage(`${data.card.term}: ${statusLabel(status)} 저장됨`);
}

cardEl.addEventListener('click', (e) => {
  if (e.target.closest('button')) return;
  state.flipped = !state.flipped;
  renderCard();
});
$('prevBtn').addEventListener('click', () => move(-1));
$('nextBtn').addEventListener('click', () => move(1));
$('shuffleBtn').addEventListener('click', randomCard);
$('knownBtn').addEventListener('click', () => mark('O'));
$('unknownBtn').addEventListener('click', () => mark('X'));
$('unknownOnlyBtn').addEventListener('click', () => { $('statusSelect').value = 'X'; state.index = 0; applyFilters(); });
$('searchInput').addEventListener('input', () => { state.index = 0; applyFilters(); });
$('categorySelect').addEventListener('change', () => { state.index = 0; applyFilters(); });
$('statusSelect').addEventListener('change', () => { state.index = 0; applyFilters(); });
$('related').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-term]');
  if (!btn) return;
  $('searchInput').value = btn.dataset.term;
  $('statusSelect').value = '';
  $('categorySelect').value = '';
  state.index = 0;
  applyFilters();
});

document.addEventListener('keydown', (e) => {
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    if (e.key === 'Escape') document.activeElement.blur();
    return;
  }
  if (e.key === ' ') { e.preventDefault(); state.flipped = !state.flipped; renderCard(); }
  else if (e.key === 'ArrowLeft') move(-1);
  else if (e.key === 'ArrowRight') move(1);
  else if (e.key.toLowerCase() === 'o') mark('O');
  else if (e.key.toLowerCase() === 'x') mark('X');
  else if (e.key.toLowerCase() === 'r') randomCard();
  else if (e.key.toLowerCase() === 'f') { e.preventDefault(); $('searchInput').focus(); }
});

loadCards().catch((err) => {
  setMessage(`로딩 실패: ${err.message}`, true);
  $('frontTerm').textContent = '로딩 실패';
  $('frontEnglish').textContent = err.message;
});
