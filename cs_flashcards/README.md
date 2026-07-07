# CS 개념 플래시카드

CSV 기반 CS 개념 플래시카드 웹앱입니다. 카드 원본과 O/X 학습 상태는 `cs_flashcards/data/CS_encyclopedia_300plus.csv`에 저장됩니다.

## 폴더 구조

```text
cs_flashcards/
├── app.py                         # FastAPI 앱
├── data/CS_encyclopedia_300plus.csv # 카드 CSV
├── static/                        # HTML/CSS/JS UI
├── scripts/                       # 실행/공개/배포 스크립트
├── vercel-proxy/                  # Vercel HTTPS 프록시
└── backups/                       # CSV 백업
```

## 실행

```bash
./cs_flashcards/scripts/run_flashcards.sh
```

접속:

```text
http://127.0.0.1:8000
```

## 주요 기능

- CSV row 1개 = 카드 1장
- 카드 클릭 또는 `Space`로 앞/뒤 뒤집기
- `O` / `X` 버튼 또는 키보드로 안다/모른다 체크
- 체크 시 CSV에 `known_status`, `last_reviewed`, `review_count` 기록
- 저장 전 `cs_flashcards/backups/`에 CSV 자동 백업
- 검색, 카테고리 필터, X/O/미학습 필터
- 자동 듣기, 재생 속도, 현재 단어 강조
- 관련 개념 클릭 시 해당 카드로 이동

## 다른 CSV로 실행

```bash
CS_FLASHCARD_CSV=/path/to/file.csv uvicorn cs_flashcards.app:app --reload
```
