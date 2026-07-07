# 금.공 IT직군 준비 A to Z

- 위키독스: https://wikidocs.net/book/20116
- GitHub: https://github.com/FLYLIKEB/finance-public-corp-prep-materials

금.공 IT직군 합격을 목표로 준비 현황, 학습 로드맵, 자기소개서 원본을 한곳에 정리한 자료입니다.

## 로컬 CS 플래시카드

`pages/CS_encyclopedia_300plus.csv`를 카드형으로 학습하고 O/X 결과를 CSV에 기록하는 로컬 웹앱은 `cs_flashcards/`에 있습니다.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r cs_flashcards/requirements.txt
uvicorn cs_flashcards.app:app --reload
```

접속: http://127.0.0.1:8000
