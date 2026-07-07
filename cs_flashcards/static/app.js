const state = {
  cards: [],
  filtered: [],
  index: 0,
  flipped: false,
  summary: null,
  audioPlaying: false,
  speechHighlight: null,
};

const $ = (id) => document.getElementById(id);
const cardEl = $('card');

function namuSearchUrl(query) {
  return `https://namu.wiki/Search?q=${encodeURIComponent(query || '')}`;
}

function normalizeTerm(value) {
  return String(value || '').trim().toLowerCase();
}

function findCardByConcept(concept) {
  const target = normalizeTerm(concept);
  if (!target) return null;
  return state.cards.find((card) => normalizeTerm(card.term) === target)
    || state.cards.find((card) => normalizeTerm(card.english) === target)
    || state.cards.find((card) => normalizeTerm(card.term).includes(target) || target.includes(normalizeTerm(card.term)));
}

function jumpToCard(card) {
  if (!card) return false;
  $('searchInput').value = '';
  $('categorySelect').value = '';
  $('statusSelect').value = '';
  state.filtered = [...state.cards];
  const found = state.filtered.findIndex((item) => item.id === card.id);
  if (found < 0) return false;
  state.index = found;
  state.flipped = true;
  renderCard();
  setMessage(`${card.term} 카드로 이동했습니다.`);
  cardEl.focus();
  return true;
}


function selectedSpeechParts() {
  return {
    term: $('speakTerm').checked,
    definition: $('speakDefinition').checked,
    detail: $('speakDetail').checked,
    related: $('speakRelated').checked,
    exam: $('speakExam').checked,
  };
}

function plainRelated(text) {
  return parseRelated(text).join(', ');
}

function speechItemsForCard(card) {
  const parts = selectedSpeechParts();
  const items = [];
  if (parts.term) items.push({key: 'term', text: `카드명. ${card.term}${card.english ? `. ${card.english}` : ''}`});
  if (parts.definition) items.push({key: 'definition', text: `간단설명. ${card.definition || ''}`});
  if (parts.detail) {
    const detailText = detailedSections(card.detailed_explanation)
      .map((section) => `${section.label}. ${section.content}`)
      .join('. ');
    items.push({key: 'detail', text: `상세설명. ${detailText}`});
  }
  if (parts.related) items.push({key: 'related', text: `관련개념. ${plainRelated(card.related_concepts)}`});
  if (parts.exam) items.push({key: 'exam', text: `시험포인트. ${card.exam_note || ''}`});
  return items.filter((item) => item.text.replace(/[.\s]/g, '').length > 0);
}

function speakQueue(items, done) {
  if (!state.audioPlaying) return;
  const item = items.shift();
  if (!item) {
    state.speechHighlight = null;
    renderCard();
    done();
    return;
  }
  state.speechHighlight = item.key;
  state.flipped = item.key !== 'term';
  renderCard();
  const utterance = new SpeechSynthesisUtterance(item.text);
  utterance.lang = 'ko-KR';
  utterance.rate = 1.05;
  utterance.pitch = 1;
  utterance.onend = () => speakQueue(items, done);
  utterance.onerror = () => {
    setMessage('음성 재생 중 오류가 발생했습니다.', true);
    stopAudioPlayback();
  };
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function setAudioButtons() {
  $('playAudioBtn').textContent = state.audioPlaying ? '▶ 재생 중' : '▶ 재생';
  $('playAudioBtn').disabled = state.audioPlaying;
  $('stopAudioBtn').disabled = !state.audioPlaying;
}

function speakCurrentAndAdvance() {
  if (!state.audioPlaying || !state.filtered.length) {
    state.audioPlaying = false;
    setAudioButtons();
    return;
  }
  const card = state.filtered[state.index];
  const items = speechItemsForCard(card);
  state.flipped = items.length ? items[0].key !== 'term' : false;
  state.speechHighlight = null;
  renderCard();
  if (!items.length) {
    moveAudioNext();
    return;
  }
  setMessage(`자동 듣기: ${state.index + 1} / ${state.filtered.length} · ${card.term}`);
  window.setTimeout(() => speakQueue([...items], moveAudioNext), 260);
}


function playCardDoneSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.24);
  gain.connect(context.destination);

  [660, 880].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime + index * 0.08);
    oscillator.connect(gain);
    oscillator.start(context.currentTime + index * 0.08);
    oscillator.stop(context.currentTime + index * 0.08 + 0.15);
  });
  window.setTimeout(() => context.close().catch(() => {}), 420);
}

function moveAudioNext() {
  if (!state.audioPlaying) return;
  playCardDoneSound();
  if (!state.filtered.length || state.index >= state.filtered.length - 1) {
    window.setTimeout(() => stopAudioPlayback('자동 듣기가 끝났습니다.'), 260);
    return;
  }
  state.index += 1;
  window.setTimeout(speakCurrentAndAdvance, 360);
}

function startAudioPlayback() {
  if (!('speechSynthesis' in window)) {
    setMessage('이 브라우저는 음성 합성을 지원하지 않습니다.', true);
    return;
  }
  if (!state.filtered.length) {
    setMessage('재생할 카드가 없습니다.', true);
    return;
  }
  const parts = selectedSpeechParts();
  if (!Object.values(parts).some(Boolean)) {
    setMessage('들을 항목을 하나 이상 체크하세요.', true);
    return;
  }
  state.audioPlaying = true;
  setAudioButtons();
  speakCurrentAndAdvance();
}

function stopAudioPlayback(message = '자동 듣기를 정지했습니다.') {
  state.audioPlaying = false;
  state.speechHighlight = null;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  setAudioButtons();
  setMessage(message);
}

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

function detailedSections(text) {
  const source = String(text || '').trim();
  if (!source) return [];
  const labels = ['의미', '동작/활용', '관련 개념', '구분 포인트', '시험 대비'];
  return labels.map((label, index) => {
    const start = source.indexOf(`${label}:`);
    if (start < 0) return null;
    const contentStart = start + label.length + 1;
    const nextPositions = labels
      .slice(index + 1)
      .map((nextLabel) => source.indexOf(`${nextLabel}:`, contentStart))
      .filter((position) => position >= 0);
    const end = nextPositions.length ? Math.min(...nextPositions) : -1;
    const content = source.slice(contentStart, end >= 0 ? end : undefined).trim();
    return content ? {label, content} : null;
  }).filter(Boolean);
}

function renderDetailedExplanation(text) {
  const sections = detailedSections(text);
  if (!sections.length) return `<div class="detail-card"><p>${escapeHtml(text || '')}</p></div>`;
  return sections.map((section) => `
    <article class="detail-card detail-${escapeHtml(section.label.replace(/[^가-힣A-Za-z0-9]/g, '-'))}">
      <div class="detail-label">${escapeHtml(section.label)}</div>
      <p>${escapeHtml(section.content)}</p>
    </article>
  `).join('');
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
  setAudioButtons();
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
  if (state.audioPlaying) stopAudioPlayback('필터가 바뀌어 자동 듣기를 정지했습니다.');
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
    ['frontNamuKoLink', 'frontNamuEnLink', 'backNamuKoLink', 'backNamuEnLink'].forEach((id) => { $(id).href = '#'; });
    return;
  }

  const c = state.filtered[state.index];
  $('frontCategory').textContent = c.category || '-';
  $('frontStatus').textContent = statusLabel(c.known_status);
  $('frontStatus').className = `badge status ${c.known_status === 'O' ? 'o' : c.known_status === 'X' ? 'x' : ''}`;
  $('frontTerm').textContent = c.term;
  $('frontEnglish').textContent = c.english || '';
  const namuKoUrl = namuSearchUrl(c.term);
  const namuEnUrl = namuSearchUrl(c.english || c.term);
  $('frontNamuKoLink').href = namuKoUrl;
  $('frontNamuKoLink').title = `${c.term} 나무위키 검색`;
  $('backNamuKoLink').href = namuKoUrl;
  $('backNamuKoLink').title = `${c.term} 나무위키 검색`;
  $('frontNamuEnLink').href = namuEnUrl;
  $('frontNamuEnLink').title = `${c.english || c.term} 나무위키 검색`;
  $('backNamuEnLink').href = namuEnUrl;
  $('backNamuEnLink').title = `${c.english || c.term} 나무위키 검색`;

  $('backCategory').textContent = c.category || '-';
  $('backId').textContent = c.id;
  $('backTerm').textContent = `${c.term}${c.english ? ' / ' + c.english : ''}`;
  $('definition').textContent = c.definition || '';
  $('detail').innerHTML = renderDetailedExplanation(c.detailed_explanation);
  $('sources').textContent = c.source_files || '';
  $('examNote').textContent = c.exam_note || '';
  const related = parseRelated(c.related_concepts);
  $('related').innerHTML = related.map((r) => `<button class="chip" type="button" data-term="${escapeHtml(r)}">${escapeHtml(r)}</button>`).join('') || '<span class="muted">없음</span>';
  applySpeechHighlight();
}


function applySpeechHighlight() {
  document.querySelectorAll('.speaking').forEach((element) => element.classList.remove('speaking'));
  const key = state.speechHighlight;
  if (!key) return;
  const target = {
    term: state.flipped ? document.querySelector('.back-term-line') : document.querySelector('.front-term-line'),
    definition: $('definition').closest('section'),
    detail: $('detail'),
    related: $('related').closest('section'),
    exam: $('examNote').closest('section'),
  }[key];
  if (target) target.classList.add('speaking');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function move(delta) {
  if (state.audioPlaying) stopAudioPlayback('수동 이동으로 자동 듣기를 정지했습니다.');
  if (!state.filtered.length) return;
  state.index = (state.index + delta + state.filtered.length) % state.filtered.length;
  state.flipped = false;
  renderCard();
}

function randomCard() {
  if (state.audioPlaying) stopAudioPlayback('랜덤 이동으로 자동 듣기를 정지했습니다.');
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
  if (e.target.closest('button, a')) return;
  state.speechHighlight = null;
  state.flipped = !state.flipped;
  renderCard();
});
$('prevBtn').addEventListener('click', () => move(-1));
$('nextBtn').addEventListener('click', () => move(1));
$('shuffleBtn').addEventListener('click', randomCard);
$('knownBtn').addEventListener('click', () => mark('O'));
$('unknownBtn').addEventListener('click', () => mark('X'));
$('unknownOnlyBtn').addEventListener('click', () => { $('statusSelect').value = 'X'; state.index = 0; applyFilters(); });
$('playAudioBtn').addEventListener('click', startAudioPlayback);
$('stopAudioBtn').addEventListener('click', () => stopAudioPlayback());
$('searchInput').addEventListener('input', () => { state.index = 0; applyFilters(); });
$('categorySelect').addEventListener('change', () => { state.index = 0; applyFilters(); });
$('statusSelect').addEventListener('change', () => { state.index = 0; applyFilters(); });
$('related').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-term]');
  if (!btn) return;
  const card = findCardByConcept(btn.dataset.term);
  if (!jumpToCard(card)) {
    setMessage(`${btn.dataset.term} 카드를 찾지 못했습니다.`, true);
  }
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
