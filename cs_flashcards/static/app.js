const state = {
  cards: [],
  filtered: [],
  index: 0,
  flipped: false,
  summary: null,
  audioPlaying: false,
  speechHighlight: null,
  speechCurrent: null,
  audioContext: null,
};

const $ = (id) => document.getElementById(id);
const cardEl = $('card');


const CATEGORY_META = {
  '데이터베이스': {emoji: '🗄️', className: 'cat-database'},
  '운영체제': {emoji: '⚙️', className: 'cat-os'},
  '네트워크': {emoji: '🌐', className: 'cat-network'},
  '자료구조·알고리즘': {emoji: '🧩', className: 'cat-algorithm'},
  '프로그래밍 언어': {emoji: '💻', className: 'cat-language'},
  '소프트웨어공학': {emoji: '🏗️', className: 'cat-software'},
  '컴퓨터구조': {emoji: '🧠', className: 'cat-architecture'},
  '보안': {emoji: '🛡️', className: 'cat-security'},
  '클라우드·분산시스템': {emoji: '☁️', className: 'cat-cloud'},
  '인공지능·데이터': {emoji: '🤖', className: 'cat-ai'},
  '금융IT·신기술': {emoji: '💳', className: 'cat-finance'},
};

function categoryMeta(category) {
  return CATEGORY_META[category] || {emoji: '📘', className: 'cat-default'};
}

function categoryLabel(category) {
  const meta = categoryMeta(category);
  return `${meta.emoji} ${category || '미분류'}`;
}

function applyCategoryTheme(category) {
  const meta = categoryMeta(category);
  cardEl.classList.remove(...Object.values(CATEGORY_META).map((item) => item.className), 'cat-default');
  cardEl.classList.add(meta.className);
}


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

function speechRate() {
  const rate = Number($('speechRate')?.value || 1);
  return Number.isFinite(rate) ? Math.min(2, Math.max(1, rate)) : 1;
}

function plainRelated(text) {
  return parseRelated(text).join(', ');
}

function speechItemsForCard(card) {
  const parts = selectedSpeechParts();
  const items = [];
  if (parts.term) {
    const prefix = '카드명. ';
    items.push({key: 'term', text: `${prefix}${card.term}`, targetText: card.term, prefixLength: prefix.length});
  }
  if (parts.definition) {
    const prefix = '간단설명. ';
    const targetText = card.definition || '';
    items.push({key: 'definition', text: `${prefix}${targetText}`, targetText, prefixLength: prefix.length});
  }
  if (parts.detail) {
    detailedSections(card.detailed_explanation).forEach((section) => {
      const prefix = `상세설명. ${section.label}. `;
      items.push({key: 'detail', detailLabel: section.label, text: `${prefix}${section.content}`, targetText: section.content, prefixLength: prefix.length});
    });
  }
  if (parts.related) {
    const prefix = '관련개념. ';
    const targetText = plainRelated(card.related_concepts);
    items.push({key: 'related', text: `${prefix}${targetText}`, targetText, prefixLength: prefix.length});
  }
  if (parts.exam) {
    const prefix = '시험포인트. ';
    const targetText = card.exam_note || '';
    items.push({key: 'exam', text: `${prefix}${targetText}`, targetText, prefixLength: prefix.length});
  }
  return items.filter((item) => item.text.replace(/[.\s]/g, '').length > 0);
}


function preferredVoiceForItem(item) {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  if (!voices.length) return null;
  const koreanVoices = voices.filter((voice) => /ko|Korean|한국|한국어/i.test(`${voice.lang} ${voice.name}`));
  const pool = koreanVoices.length ? koreanVoices : voices;
  if (item.key === 'term') {
    return pool.find((voice) => /male|남성|man|injoon|준|yuna male/i.test(voice.name))
      || pool.find((voice) => !/female|여성|woman|heami|yuna|유나/i.test(voice.name))
      || pool[0];
  }
  return pool.find((voice) => /female|여성|woman|heami|yuna|유나/i.test(voice.name))
    || pool[0];
}

function speechPitchForItem(item) {
  return item.key === 'term' ? 0.88 : 1;
}

function speechRateForItem(item) {
  const baseRate = speechRate();
  return baseRate;
}

function speakQueue(items, done) {
  if (!state.audioPlaying) return;
  const item = items.shift();
  if (!item) {
    state.speechHighlight = null;
    state.speechCurrent = null;
    renderCard();
    done();
    return;
  }
  state.speechHighlight = item.key;
  state.speechCurrent = {...item, charIndex: 0};
  state.flipped = item.key !== 'term';
  renderCard();
  const utterance = new SpeechSynthesisUtterance(item.text);
  utterance.lang = 'ko-KR';
  const preferredVoice = preferredVoiceForItem(item);
  if (preferredVoice) utterance.voice = preferredVoice;
  utterance.rate = speechRateForItem(item);
  utterance.pitch = speechPitchForItem(item);
  utterance.onboundary = (event) => {
    if (!state.audioPlaying || !state.speechCurrent) return;
    state.speechCurrent.charIndex = Math.max(0, (event.charIndex || 0) - item.prefixLength);
    renderCard();
  };
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



function ensureAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!state.audioContext || state.audioContext.state === 'closed') {
    state.audioContext = new AudioContextClass();
  }
  if (state.audioContext.state === 'suspended') {
    state.audioContext.resume().catch(() => {});
  }
  return state.audioContext;
}

function unlockAudioContext() {
  const context = ensureAudioContext();
  if (!context) return;
  const gain = context.createGain();
  gain.gain.value = 0.0001;
  gain.connect(context.destination);
  const oscillator = context.createOscillator();
  oscillator.connect(gain);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.02);
}

function playCardDoneSound() {
  const context = ensureAudioContext();
  if (!context) return;
  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.22, now + 0.018);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
  master.connect(context.destination);

  [784, 1046.5, 1318.5].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.075);
    oscillator.connect(master);
    oscillator.start(now + index * 0.075);
    oscillator.stop(now + index * 0.075 + 0.18);
  });
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
  unlockAudioContext();
  window.speechSynthesis.getVoices();
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
  state.speechCurrent = null;
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

function currentWordHtml(text, key, detailLabel = null) {
  const source = String(text || '');
  const current = state.speechCurrent;
  const shouldHighlight = current
    && current.key === key
    && (detailLabel === null || current.detailLabel === detailLabel);
  if (!shouldHighlight) return escapeHtml(source);

  const charIndex = Math.max(0, current.charIndex || 0);
  const matches = [...source.matchAll(/\S+/g)];
  let activeIndex = matches.findIndex((match) => charIndex >= match.index && charIndex < match.index + match[0].length);
  if (activeIndex < 0) {
    activeIndex = matches.findIndex((match) => charIndex < match.index);
    if (activeIndex < 0 && matches.length) activeIndex = matches.length - 1;
  }

  let html = '';
  let cursor = 0;
  matches.forEach((match, index) => {
    html += escapeHtml(source.slice(cursor, match.index));
    const word = escapeHtml(match[0]);
    html += index === activeIndex ? `<span class="current-word">${word}</span>` : word;
    cursor = match.index + match[0].length;
  });
  html += escapeHtml(source.slice(cursor));
  return html;
}

function renderDetailedExplanation(text) {
  const sections = detailedSections(text);
  if (!sections.length) return `<div class="detail-card"><p>${currentWordHtml(text || '', 'detail')}</p></div>`;
  return sections.map((section) => `
    <article class="detail-card detail-${escapeHtml(section.label.replace(/[^가-힣A-Za-z0-9]/g, '-'))}">
      <div class="detail-label">${escapeHtml(section.label)}</div>
      <p>${currentWordHtml(section.content, 'detail', section.label)}</p>
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
    applyCategoryTheme('');
    ['frontNamuKoLink', 'frontNamuEnLink', 'backNamuKoLink', 'backNamuEnLink'].forEach((id) => { $(id).href = '#'; });
    return;
  }

  const c = state.filtered[state.index];
  applyCategoryTheme(c.category);
  $('frontCategory').textContent = categoryLabel(c.category);
  $('frontStatus').textContent = statusLabel(c.known_status);
  $('frontCategory').className = `badge category-badge ${categoryMeta(c.category).className}`;
  $('backCategory').className = `badge category-badge ${categoryMeta(c.category).className}`;
  $('frontStatus').className = `badge status ${c.known_status === 'O' ? 'o' : c.known_status === 'X' ? 'x' : ''}`;
  $('frontTerm').innerHTML = currentWordHtml(c.term, 'term');
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

  $('backCategory').textContent = categoryLabel(c.category);
  $('backId').textContent = c.id;
  $('backTerm').innerHTML = `${currentWordHtml(c.term, 'term')}${c.english ? ' / ' + escapeHtml(c.english) : ''}`;
  $('definition').innerHTML = currentWordHtml(c.definition || '', 'definition');
  $('detail').innerHTML = renderDetailedExplanation(c.detailed_explanation);
  $('sources').textContent = c.source_files || '';
  $('examNote').innerHTML = currentWordHtml(c.exam_note || '', 'exam');
  const related = parseRelated(c.related_concepts);
  $('related').innerHTML = related.map((r) => `<button class="chip" type="button" data-term="${escapeHtml(r)}">${currentWordHtml(r, 'related')}</button>`).join('') || '<span class="muted">없음</span>';
  applySpeechHighlight();
}


function applySpeechHighlight() {
  document.querySelectorAll('.speaking-section').forEach((element) => element.classList.remove('speaking-section'));
  const current = state.speechCurrent;
  if (!current) return;
  const target = {
    term: state.flipped ? document.querySelector('.back-term-line') : document.querySelector('.front-term-line'),
    definition: $('definition').closest('section'),
    detail: current.detailLabel
      ? [...document.querySelectorAll('.detail-card')].find((card) => card.querySelector('.detail-label')?.textContent === current.detailLabel)
      : $('detail'),
    related: $('related').closest('section'),
    exam: $('examNote').closest('section'),
  }[current.key];
  if (target) target.classList.add('speaking-section');
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
  state.speechCurrent = null;
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
