# 금.공 IT직군 준비 A to Z

- 위키독스: https://wikidocs.net/book/20116
- GitHub: https://github.com/FLYLIKEB/finance-public-corp-prep-materials

금.공 IT직군 합격을 목표로 준비 현황, 학습 로드맵, 자기소개서 원본을 한곳에 정리한 자료입니다.

## CS 플래시카드

CS 플래시카드 관련 파일은 모두 `cs_flashcards/` 아래에 모았습니다.

```text
cs_flashcards/
├── app.py                         # FastAPI 앱
├── data/CS_encyclopedia_300plus.csv # 카드 원본/학습상태 CSV
├── static/                        # 프론트엔드 UI
├── scripts/                       # 로컬/공개/배포 스크립트
├── vercel-proxy/                  # cs.chamung.com HTTPS 프록시 설정
└── backups/                       # O/X 저장 전 CSV 백업
```

### 로컬 실행

가장 간단한 실행:

```bash
./cs_flashcards/scripts/run_flashcards.sh
```

수동 실행:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r cs_flashcards/requirements.txt
uvicorn cs_flashcards.app:app --reload
```

접속: http://127.0.0.1:8000

### iPhone/외부 임시 접속: Cloudflare Tunnel

같은 Wi‑Fi가 아니어도 폰에서 임시 주소로 접속하려면:

```bash
./cs_flashcards/scripts/run_public_flashcards.sh
```

- 로컬 FastAPI 서버를 비밀번호 보호 상태로 실행합니다.
- Cloudflare Tunnel 임시 공개 주소(`https://...trycloudflare.com`)를 생성합니다.
- O/X 체크 결과는 `cs_flashcards/data/CS_encyclopedia_300plus.csv`에 저장됩니다.
- 기본 아이디는 `cs`입니다.
- 비밀번호는 처음 실행 시 `.omx/cs_flashcards_public_password`에 저장됩니다.

직접 지정:

```bash
CS_FLASHCARDS_USERNAME=cs CS_FLASHCARDS_PASSWORD='원하는비밀번호' ./cs_flashcards/scripts/run_public_flashcards.sh
```

### Cloudflare 고정주소 설정

Cloudflare DNS가 관리하는 도메인을 사용할 때만 아래 방식을 사용합니다.

```bash
./cs_flashcards/scripts/setup_fixed_flashcards_tunnel.sh cards.your-domain.com
./cs_flashcards/scripts/run_public_flashcards.sh
```

고정주소 설정을 지우고 임시 주소로 돌아가려면:

```bash
rm .omx/cs_flashcards_tunnel.env
```

### 휴대폰 고정 공개 접속: Lightsail + Vercel HTTPS 프록시

현재 최종 공개 구성은 Cloudflare가 아니라 **Lightsail + Vercel HTTPS 프록시**입니다.
앱과 CSV 저장은 기존 Lightsail 서버에서 처리하고, `cs.chamung.com` HTTPS 접속만 Vercel이 프록시합니다.

- 공개 주소: `https://cs.chamung.com`
- 로그인: `cs` / `az980831`
- 원본 주소: `http://cs-origin.chamung.com` -> Lightsail `3.39.48.139`
- 서버 경로: `/home/ubuntu/cs-flashcards`
- systemd 서비스: `cs-flashcards`
- 서버 CSV: `/home/ubuntu/cs-flashcards/cs_flashcards/data/CS_encyclopedia_300plus.csv`

Lightsail 앱 재배포:

```bash
./cs_flashcards/scripts/deploy_lightsail_flashcards.sh
```

Vercel HTTPS 프록시 재배포:

```bash
vercel --cwd cs_flashcards/vercel-proxy --prod --yes
```

DNS는 `cs.chamung.com -> Vercel(A 76.76.21.21)`, `cs-origin.chamung.com -> Lightsail(A 3.39.48.139)` 구조입니다. 두 레코드를 분리해야 프록시 루프가 생기지 않습니다.
