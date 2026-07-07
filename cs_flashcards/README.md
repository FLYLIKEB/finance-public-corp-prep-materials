# CS 개념 플래시카드 로컬 웹앱

`pages/CS_encyclopedia_300plus.csv`의 각 row를 카드 1장으로 보여주고, 학습 여부를 CSV에 바로 기록하는 로컬 전용 웹앱입니다.

## 실행

```bash
cd /Users/jwp/macDocuments/금융공기업준비/wikidocs-ebook
python3 -m venv .venv
source .venv/bin/activate
pip install -r cs_flashcards/requirements.txt
uvicorn cs_flashcards.app:app --reload
```

브라우저에서 접속합니다.

```text
http://127.0.0.1:8000
```

## 기능

- CSV row 1개 = 카드 1장
- 카드 클릭 또는 `Space`로 앞/뒤 뒤집기
- `O` / `X` 버튼 또는 키보드로 안다/모른다 체크
- 체크 시 CSV에 `known_status`, `last_reviewed`, `review_count` 기록
- 저장 전 `cs_flashcards/backups/`에 CSV 자동 백업
- 검색, 카테고리 필터, 학습 상태 필터
- X만 복습, 랜덤 카드
- 관련 개념 칩 클릭 시 해당 개념 검색

## 단축키

- `Space`: 카드 뒤집기
- `←` / `→`: 이전/다음 카드
- `O`: 안다로 기록
- `X`: 모른다로 기록
- `R`: 랜덤 카드
- `F`: 검색창 포커스

## 다른 CSV로 실행

```bash
CS_FLASHCARD_CSV=/path/to/file.csv uvicorn cs_flashcards.app:app --reload
```
