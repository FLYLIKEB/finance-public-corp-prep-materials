#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

HOSTNAME="${1:-${CS_FLASHCARDS_PUBLIC_HOSTNAME:-}}"
TUNNEL_NAME="${2:-${CS_FLASHCARDS_TUNNEL_NAME:-cs-flashcards}}"
PID_DIR="$ROOT_DIR/.omx"
CONFIG_FILE="$PID_DIR/cs_flashcards_tunnel.env"
PYTHON_BIN="${PYTHON_BIN:-python3}"
USERNAME="${CS_FLASHCARDS_USERNAME:-cs}"
PASSWORD_FILE="$PID_DIR/cs_flashcards_public_password"

if [[ -z "$HOSTNAME" ]]; then
  cat >&2 <<'EOF'
사용법:
  ./setup_fixed_flashcards_tunnel.sh cards.example.com

필수 조건:
  - Cloudflare 계정이 있어야 합니다.
  - 해당 도메인이 Cloudflare DNS에 연결되어 있어야 합니다.
  - 예: cards.your-domain.com
EOF
  exit 2
fi

mkdir -p "$PID_DIR"
chmod 700 "$PID_DIR" 2>/dev/null || true

install_cloudflared_if_needed() {
  if command -v cloudflared >/dev/null 2>&1; then
    return 0
  fi
  if command -v brew >/dev/null 2>&1; then
    printf 'cloudflared가 없어 Homebrew로 설치합니다...\n'
    brew install cloudflared
    return 0
  fi
  printf 'cloudflared가 없습니다. 먼저 설치하세요.\n' >&2
  exit 1
}

make_password_if_needed() {
  if [[ -n "${CS_FLASHCARDS_PASSWORD:-}" ]]; then
    printf '%s' "$CS_FLASHCARDS_PASSWORD" > "$PASSWORD_FILE"
    chmod 600 "$PASSWORD_FILE" 2>/dev/null || true
    return 0
  fi
  if [[ -f "$PASSWORD_FILE" ]]; then
    return 0
  fi
  "$PYTHON_BIN" - <<'PY' > "$PASSWORD_FILE"
import secrets
print(secrets.token_urlsafe(12))
PY
  chmod 600 "$PASSWORD_FILE" 2>/dev/null || true
}

install_cloudflared_if_needed
make_password_if_needed

if [[ ! -f "$HOME/.cloudflared/cert.pem" ]]; then
  printf 'Cloudflare 로그인이 필요합니다. 브라우저에서 도메인을 선택하세요.\n'
  cloudflared tunnel login
fi

if cloudflared tunnel info "$TUNNEL_NAME" >/dev/null 2>&1; then
  printf '기존 Tunnel 사용: %s\n' "$TUNNEL_NAME"
else
  printf '새 Tunnel 생성: %s\n' "$TUNNEL_NAME"
  cloudflared tunnel create "$TUNNEL_NAME"
fi

printf 'DNS 라우팅 설정: %s -> %s\n' "$HOSTNAME" "$TUNNEL_NAME"
cloudflared tunnel route dns --overwrite-dns "$TUNNEL_NAME" "$HOSTNAME"

cat > "$CONFIG_FILE" <<EOF
CS_FLASHCARDS_PUBLIC_HOSTNAME="$HOSTNAME"
CS_FLASHCARDS_TUNNEL_NAME="$TUNNEL_NAME"
CS_FLASHCARDS_PUBLIC_USERNAME="$USERNAME"
EOF
chmod 600 "$CONFIG_FILE" 2>/dev/null || true

cat <<EOF

✅ 고정주소 설정 완료

주소: https://$HOSTNAME
아이디: $USERNAME
비밀번호: $(cat "$PASSWORD_FILE")
Tunnel: $TUNNEL_NAME
설정파일: $CONFIG_FILE

앞으로는 아래 명령만 실행하면 같은 주소로 열립니다:
  ./run_public_flashcards.sh
EOF
