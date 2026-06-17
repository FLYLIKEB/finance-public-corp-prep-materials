# CS Visual Aids Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add directly visible external CS/IT concept images to the Markdown study documents, then verify, commit, and push.

**Architecture:** This is a documentation-only change. Each task modifies a small group of Markdown pages by inserting image blocks immediately after the relevant explanatory text. Images use external URLs and include a short Korean learning caption plus source link.

**Tech Stack:** Markdown, Git, external image URLs from stable public sources such as Wikimedia Commons and official documentation.

---

## File Structure

- Modify: `pages/04-01-빅데이터-블록체인-머신러닝.md` — add logistic curve image near the logistic regression explanation.
- Modify: `pages/08-01-OSI와-TCP-IP.md` — add OSI model image near the OSI/TCP-IP overview.
- Modify: `pages/08-02-01-3-Way-Handshake.md` — add TCP three-way handshake image near the SYN/SYN-ACK/ACK explanation.
- Modify: `pages/09-02-02-DFS-BFS-최단경로.md` — add graph traversal illustration near the DFS/BFS comparison.
- Optional after inspection: modify `pages/15-2-캐시와-메모리-계층.md` if it contains a suitable memory hierarchy section.
- No generated assets are created because the selected approach is external image URLs.

### Task 1: Add machine learning visual aid

**Files:**
- Modify: `pages/04-01-빅데이터-블록체인-머신러닝.md:197-200`

- [ ] **Step 1: Insert logistic curve image block after logistic regression explanation**

Insert this block immediately after the bullet that explains the sigmoid technique:

```md

![로지스틱 회귀의 시그모이드 곡선](https://upload.wikimedia.org/wikipedia/commons/8/88/Logistic-curve.svg)
> 그림: 로지스틱 회귀는 선형 결합 결과를 시그모이드 함수에 통과시켜 0~1 사이의 확률로 해석한다.  
> 출처: Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Logistic-curve.svg
```

- [ ] **Step 2: Verify the local Markdown block exists once**

Run:

```bash
grep -n "Logistic-curve.svg\|로지스틱 회귀의 시그모이드 곡선" pages/04-01-빅데이터-블록체인-머신러닝.md
```

Expected: two matching lines, one image line and one source/caption-related line.

### Task 2: Add network visual aids

**Files:**
- Modify: `pages/08-01-OSI와-TCP-IP.md:13-17`
- Modify: `pages/08-02-01-3-Way-Handshake.md:13-17`

- [ ] **Step 1: Insert OSI model image block after the OSI analogy paragraph**

Insert this block after the bullet list in `## 쉽게 이해하기`:

```md

![OSI 7계층 구조](https://upload.wikimedia.org/wikipedia/commons/8/8d/OSI_Model_v1.svg)
> 그림: OSI 7계층은 물리 전송에서 응용 서비스까지 통신 역할을 계층별로 나눈 모델이다.  
> 출처: Wikimedia Commons, https://commons.wikimedia.org/wiki/File:OSI_Model_v1.svg
```

- [ ] **Step 2: Insert TCP three-way handshake image block after the handshake explanation**

Insert this block after the bullet list in `## 쉽게 이해하기`:

```md

![TCP 3-Way Handshake 흐름](https://upload.wikimedia.org/wikipedia/commons/8/84/Tcp-handshake.svg)
> 그림: TCP 연결 수립은 클라이언트의 SYN, 서버의 SYN-ACK, 클라이언트의 ACK 순서로 진행된다.  
> 출처: Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Tcp-handshake.svg
```

- [ ] **Step 3: Verify both network image blocks exist**

Run:

```bash
grep -n "OSI_Model_v1.svg\|Tcp-handshake.svg" pages/08-01-OSI와-TCP-IP.md pages/08-02-01-3-Way-Handshake.md
```

Expected: one match in each target file.

### Task 3: Add graph traversal visual aid

**Files:**
- Modify: `pages/09-02-02-DFS-BFS-최단경로.md:13-17`

- [ ] **Step 1: Insert BFS/DFS image block after the DFS/BFS comparison**

Insert this block after the bullet list in `## 쉽게 이해하기`:

```md

![BFS와 DFS 탐색 순서 예시](https://upload.wikimedia.org/wikipedia/commons/5/5d/Breadth-First-Search-Algorithm.gif)
> 그림: BFS는 시작점에서 가까운 정점을 먼저 넓게 방문하므로 무가중치 최단거리와 연결된다. DFS는 한 경로를 깊게 들어간 뒤 되돌아오는 방식이다.  
> 출처: Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Breadth-First-Search-Algorithm.gif
```

- [ ] **Step 2: Verify graph traversal image block exists**

Run:

```bash
grep -n "Breadth-First-Search-Algorithm.gif\|BFS와 DFS 탐색 순서 예시" pages/09-02-02-DFS-BFS-최단경로.md
```

Expected: two matching lines, one image line and one source/caption-related line.

### Task 4: Inspect and optionally add memory hierarchy visual aid

**Files:**
- Inspect: `pages/15-2-캐시와-메모리-계층.md`
- Modify: `pages/15-2-캐시와-메모리-계층.md` only if it contains a memory hierarchy section.

- [ ] **Step 1: Inspect the cache and memory hierarchy page**

Run:

```bash
grep -n "메모리 계층\|캐시\|지역성" pages/15-2-캐시와-메모리-계층.md
```

Expected: lines identifying cache or memory hierarchy content.

- [ ] **Step 2: If the page contains a suitable section, insert memory hierarchy image block near that explanation**

Use this exact block:

```md

![메모리 계층 구조](https://upload.wikimedia.org/wikipedia/commons/0/0c/ComputerMemoryHierarchy.svg)
> 그림: 메모리 계층은 CPU에 가까울수록 빠르고 비싸며, 멀어질수록 느리지만 대용량이라는 특징을 가진다.  
> 출처: Wikimedia Commons, https://commons.wikimedia.org/wiki/File:ComputerMemoryHierarchy.svg
```

If the page does not contain a suitable explanation, do not modify it.

- [ ] **Step 3: Verify optional image block if inserted**

Run:

```bash
grep -n "ComputerMemoryHierarchy.svg\|메모리 계층 구조" pages/15-2-캐시와-메모리-계층.md || true
```

Expected: if inserted, two matching lines; if not inserted, no output is acceptable.

### Task 5: Validate Markdown and image URLs

**Files:**
- Inspect modified Markdown pages.

- [ ] **Step 1: Check changed Markdown image syntax**

Run:

```bash
git diff -- pages | grep -n "!\[\|> 출처:\|> 그림:"
```

Expected: each inserted image line has an adjacent `> 그림:` and `> 출처:` line.

- [ ] **Step 2: Check that external URLs respond**

Run:

```bash
python3 - <<'PY'
import re, urllib.request
from pathlib import Path
files = [
    Path('pages/04-01-빅데이터-블록체인-머신러닝.md'),
    Path('pages/08-01-OSI와-TCP-IP.md'),
    Path('pages/08-02-01-3-Way-Handshake.md'),
    Path('pages/09-02-02-DFS-BFS-최단경로.md'),
    Path('pages/15-2-캐시와-메모리-계층.md'),
]
urls = []
for path in files:
    if not path.exists():
        continue
    for url in re.findall(r'!\[[^\]]*\]\((https?://[^)]+)\)', path.read_text(encoding='utf-8')):
        urls.append((path, url))
for path, url in urls:
    req = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            print(f'{res.status} {path} {url}')
    except Exception as exc:
        print(f'ERROR {path} {url} {exc}')
        raise
PY
```

Expected: every checked URL prints `200`.

- [ ] **Step 3: Review working tree changes**

Run:

```bash
git status --short && git diff --stat && git diff -- pages
```

Expected: only intended Markdown pages are modified, plus this plan if it has not already been committed.

### Task 6: Commit and push

**Files:**
- Modified Markdown files.
- `docs/superpowers/plans/2026-06-17-cs-visual-aids.md`

- [ ] **Step 1: Commit implementation plan before content edits if not committed**

Run:

```bash
git add docs/superpowers/plans/2026-06-17-cs-visual-aids.md
git commit -m "docs: plan cs visual aids"
```

Expected: commit succeeds, or Git reports nothing to commit if it was already committed.

- [ ] **Step 2: Commit content changes**

Run:

```bash
git add pages/04-01-빅데이터-블록체인-머신러닝.md pages/08-01-OSI와-TCP-IP.md pages/08-02-01-3-Way-Handshake.md pages/09-02-02-DFS-BFS-최단경로.md pages/15-2-캐시와-메모리-계층.md
git commit -m "docs: add cs visual aid links"
```

Expected: commit succeeds with the modified documentation files.

- [ ] **Step 3: Push commits**

Run:

```bash
git push
```

Expected: push succeeds and remote branch is updated.

## Self-Review

- Spec coverage: The plan covers direct external URL insertion, captions with source, selective document modification, syntax verification, URL verification, commit, and push.
- Placeholder scan: The plan contains no TBD, TODO, or unspecified implementation steps.
- Type consistency: This is Markdown-only work; all file paths and image block formats are consistent across tasks.
