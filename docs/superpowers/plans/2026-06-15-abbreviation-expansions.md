# Wikidocs Abbreviation Expansions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full-form explanations for abbreviation-only IT/CS terms across Wikidocs source pages, then verify, commit, and push.

**Architecture:** Update Markdown source under `pages/` rather than generated artifacts. Add concise expansions at the first explanatory occurrence in each relevant concept page and in high-level overview lists where abbreviations appear without context. Preserve exam-question wording and avoid noisy repeated expansions in every table row.

**Tech Stack:** Markdown content repository, Python helper scripts for scanning/editing, git for commit and push.

---

### Task 1: Scan abbreviation candidates

**Files:**
- Inspect: `pages/*.md`

- [ ] **Step 1: Search likely abbreviations**

Run:
```bash
python3 - <<'PY'
from pathlib import Path
import re, collections
files=list(Path('pages').glob('*.md'))+[Path('README.md'),Path('TOC.md')]
pat=re.compile(r'(?<![A-Za-z0-9가-힣])(?:[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*|[0-9]+NF|3-Way)(?![A-Za-z0-9가-힣])')
counts=collections.Counter()
for p in files:
    for line in p.read_text(encoding='utf-8').splitlines():
        for m in pat.finditer(line):
            tok=m.group(0)
            if len(tok)>1:
                counts[tok]+=1
for tok,n in counts.most_common(120):
    print(f'{tok}\t{n}')
PY
```
Expected: common abbreviations such as SQL, IT, DB, CPU, TCP, OSI, FCFS, SJF, HRN, RR, IDS, IPS, PCB, TLB, DMA, BFS, DFS.

### Task 2: Apply curated expansions

**Files:**
- Modify: selected `pages/*.md`

- [ ] **Step 1: Run a deterministic update script**

Use a Python script with exact string replacements for core concept pages. Replace headings or first bullets with Korean-friendly expansions such as:
- `FCFS(First-Come, First-Served, 선입선처리)`
- `SJF(Shortest Job First, 최단 작업 우선)`
- `HRN(Highest Response-ratio Next, 최고 응답률 우선)`
- `RR(Round Robin, 라운드 로빈)`
- `OSI(Open Systems Interconnection, 개방형 시스템 상호연결)`
- `TCP(Transmission Control Protocol, 전송 제어 프로토콜)`
- `IP(Internet Protocol, 인터넷 프로토콜)`
- `IDS(Intrusion Detection System, 침입 탐지 시스템)`
- `IPS(Intrusion Prevention System, 침입 방지 시스템)`
- `PCB(Process Control Block, 프로세스 제어 블록)`
- `TLB(Translation Lookaside Buffer, 주소 변환 캐시)`
- `DMA(Direct Memory Access, 직접 메모리 접근)`
- `BFS(Breadth-First Search, 너비 우선 탐색)`
- `DFS(Depth-First Search, 깊이 우선 탐색)`

### Task 3: Verify content quality

**Files:**
- Inspect: modified `pages/*.md`

- [ ] **Step 1: Review diff**

Run:
```bash
git diff -- pages README.md TOC.md
```
Expected: only Markdown explanation additions, no accidental generated artifact or binary changes.

- [ ] **Step 2: Search key unresolved pages**

Run targeted searches for major abbreviations and inspect remaining abbreviation-only occurrences. Keep exam prompt wording intact when appropriate.

### Task 4: Commit and push

**Files:**
- Commit: modified Markdown pages and this plan document if present.

- [ ] **Step 1: Commit**

Run:
```bash
git add pages docs/superpowers/plans/2026-06-15-abbreviation-expansions.md
git commit -m "docs: expand IT abbreviations in Wikidocs pages"
```
Expected: commit succeeds.

- [ ] **Step 2: Push**

Run:
```bash
git push
```
Expected: branch pushed to configured remote.

---

## Self-review

- Spec coverage: user asked to add explanations for abbreviation-only Wikidocs terms and auto commit/push; tasks cover scan, edit, verify, commit, push.
- Placeholder scan: no placeholders remain.
- Scope check: focused Markdown documentation update, suitable for one implementation cycle.
