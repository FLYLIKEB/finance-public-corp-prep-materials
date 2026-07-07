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

## iPhone/외부 접속: Cloudflare Tunnel

폰에서 같은 Wi‑Fi가 아니어도 접속하려면 아래 스크립트 하나를 실행하세요.

```bash
./run_public_flashcards.sh
```

동작:

- 로컬 FastAPI 서버를 비밀번호 보호 상태로 실행합니다.
- Cloudflare Tunnel 임시 공개 주소(`https://...trycloudflare.com`)를 생성합니다.
- 터미널에 표시되는 주소/아이디/비밀번호로 iPhone Safari 또는 Chrome에서 접속합니다.
- O/X 체크 결과는 이 Mac의 `pages/CS_encyclopedia_300plus.csv`에 저장됩니다.

기본 아이디는 `cs`입니다. 비밀번호는 처음 실행 시 자동 생성되어 `.omx/cs_flashcards_public_password`에 저장됩니다.
직접 지정하려면 다음처럼 실행하세요.

```bash
CS_FLASHCARDS_USERNAME=cs CS_FLASHCARDS_PASSWORD='원하는비밀번호' ./run_public_flashcards.sh
```

주의:

- 이 터미널을 닫으면 외부 공개 접속도 종료됩니다.
- `cloudflared`가 없으면 macOS에서는 Homebrew로 자동 설치를 시도합니다.
- 공개 URL은 임시 주소입니다. 다시 실행하면 주소가 바뀔 수 있습니다.

### 고정주소로 쓰기

`trycloudflare.com` 임시 주소는 Cloudflare가 매번 랜덤으로 발급하므로 고정할 수 없습니다. 주소를 고정하려면 Cloudflare에 연결된 본인 도메인/서브도메인이 필요합니다.

최초 1회만 아래처럼 설정하세요.

```bash
./setup_fixed_flashcards_tunnel.sh cards.your-domain.com
```

처음 실행 시 Cloudflare 로그인 브라우저가 열릴 수 있습니다. 로그인 후 도메인을 선택하면:

- `cards.your-domain.com` DNS가 터널에 연결됩니다.
- 설정은 `.omx/cs_flashcards_tunnel.env`에 저장됩니다.
- 아이디/비밀번호는 기존처럼 고정 저장됩니다.

그 다음부터는 항상 아래 명령만 실행하면 같은 주소로 접속합니다.

```bash
./run_public_flashcards.sh
```

고정주소 설정을 지우고 다시 임시 주소로 쓰려면:

```bash
rm .omx/cs_flashcards_tunnel.env
```

### chamung.com 도메인 활용

ChaLog 설정을 확인한 결과 `chamung.com`은 현재 **Vercel DNS**를 사용합니다.
Cloudflare Tunnel 고정주소는 `<UUID>.cfargotunnel.com` CNAME을 쓰지만, 이 대상은 같은 Cloudflare 계정의 DNS 레코드에서만 프록시됩니다. 따라서 Vercel DNS에 CNAME만 추가하는 방식으로는 `cs.chamung.com`을 바로 연결할 수 없습니다.

현재는 Cloudflare 네임서버 이전 없이, 아래의 Lightsail + Vercel HTTPS 프록시 방식을 최종 구성으로 사용합니다.

## 휴대폰 공개 접속: Lightsail + Vercel HTTPS 프록시

플래시카드 앱과 CSV 저장은 기존 Lightsail 서버에서 처리하고, `cs.chamung.com`의 HTTPS 접속만 Vercel이 프록시합니다. Lightsail 외부 방화벽에서 443이 닫혀 있어도 아이폰/외부망에서는 HTTPS 주소를 사용할 수 있습니다.

- 공개 주소: `https://cs.chamung.com`
- 로그인: `cs` / `az980831`
- 원본 주소: `http://cs-origin.chamung.com` -> Lightsail `3.39.48.139`
- 서버 경로: `/home/ubuntu/cs-flashcards`
- systemd 서비스: `cs-flashcards`
- 서버 CSV: `/home/ubuntu/cs-flashcards/pages/CS_encyclopedia_300plus.csv`

Lightsail 앱 재배포:

```bash
./deploy_lightsail_flashcards.sh
```

Vercel HTTPS 프록시 재배포:

```bash
vercel --cwd vercel-cs-proxy --prod --yes
```

DNS는 `cs.chamung.com -> Vercel(A 76.76.21.21)`, `cs-origin.chamung.com -> Lightsail(A 3.39.48.139)` 구조입니다. 두 레코드를 분리해야 프록시 루프가 생기지 않습니다.

