# 08-03. HTTP-DNS-TLS

> 학습 목적: 웹 통신 핵심 프로토콜의 역할을 정리한다.
> 관련 기출: [05-11-네트워크-기출-모음](05-11-네트워크-기출-모음.md)
> 연결 핵심정리: [04-4-네트워크-프로토콜-보안](04-04-네트워크-프로토콜-보안.md)

## 핵심 개념

- HTTP는 웹 요청과 응답을 주고받는 애플리케이션 계층 프로토콜이다. 요청 라인(method, path, version), 헤더, 바디 구조를 갖는다.
- DNS는 도메인 이름을 IP 주소로 변환하는 분산 데이터베이스 시스템이다. 질의는 iterative(반복) 또는 recursive(재귀) 방식으로 처리된다.
- TLS는 전송 계층에서 통신을 암호화하고 상대를 인증하며, 공개키 기반 인증과 대칭키 암호를 결합해 성능과 보안을 함께 만족시킨다.


### 서술형 확장 개념 (면접 대비 포인트)

- DNS 조회 흐름
  - stub resolver(클라이언트) → recursive resolver(ISP/공용 DNS) → root → TLD → authoritative name server 식으로 점진적으로 해답을 얻는다.
  - TTL(Time-To-Live)은 레코드의 캐시 지속 시간을 의미한다. 낮은 TTL은 변경 반영이 빠르지만 조회 비용이 증가한다.
  - 주요 레코드 유형: A/AAAA(IPv4/IPv6 주소), CNAME(별칭), MX(메일 서버), TXT(도메인 소유/정책/SPF/DKIM), NS(권한 네임서버), PTR(역방향 조회), SRV(서비스 위치).
  - 보안: DNS 캐시 포이즈닝 공격을 설명하고, DNSSEC을 통해 응답 무결성을 검증하는 방식(서명, 체인 오브 트러스트)을 언급하라.

- HTTP 핵심
  - Methods: GET(조회, 멱등), POST(생성/처리, 비멱등 가능), PUT(교체, 멱등), PATCH(부분 갱신), DELETE(삭제), HEAD, OPTIONS 등.
  - 상태 코드: 1xx(정보), 2xx(성공), 3xx(리다이렉션), 4xx(클라이언트 오류), 5xx(서버 오류). 면접에서는 301 vs 302, 307/308 차이를 묻기도 한다(임시 vs 영구, 메서드 보존 여부).
  - 헤더/캐시: Cache-Control, Expires, ETag, Last-Modified 등을 통해 캐싱 동작을 설명할 수 있어야 한다. ETag 기반 조건부 요청(If-None-Match)은 효율적 리소스 재사용 메커니즘이다.
  - 연결: HTTP/1.1의 keep-alive와 pipelining(실무에서는 잘 사용되지 않음), HTTP/2의 multiplexing과 HPACK(header compression), HTTP/3의 QUIC(UDP 기반, 손실복구와 연결 이동성 개선).
  - 전송: chunked transfer-encoding, Content-Length, multipart 등.
  - 보안 및 정책: CORS(교차 출처 리소스 공유), 쿠키의 SameSite/HttpOnly/Secure 속성, CSP(Content Security Policy) 수준 설명.

- TLS 핵심
  - Handshake 개요: 클라이언트 헬로 → 서버 헬로(+서버 인증서) → 키 교환(서로 합의된 알고리즘에 따라) → Finished. 이 과정에서 인증서 체인 검증, 서버 이름 표시(SNI), ALPN(애플리케이션 프로토콜 협상)을 수행한다.
  - 암호 구분: 공개키 암호(RSA, ECDSA)로 인증 및 키 교환을 시작하고, 대칭키(예: AES)로 실제 데이터를 암호화한다. ECDHE 같은 키교환은 forward secrecy(전향 비밀성)를 제공한다.
  - 인증서: 신뢰할 수 있는 CA가 서명한 인증서 체인(루트 CA → 중간 CA → 서버 인증서). OCSP/CRL로 폐지 확인 가능(OCSP stapling으로 성능 개선).
  - 공격/취약점: 중간자(MITM), 프로토콜 취약점(POODLE, BEAST, Heartbleed 같은 과거 사례), 약한 암호 스위트 사용의 위험성, SNI 기반 프라이버시 이슈 등을 설명하라.


## 쉽게 이해하기

- DNS는 전화번호부처럼 도메인 이름을 IP 주소로 바꿔 준다. (예: example.com → 93.184.216.34)
- HTTP는 웹브라우저와 서버가 요청과 응답을 주고받는 대화 규칙이다. (요청: GET /index.html, 응답: 200 OK + 바디)
- TLS는 그 대화를 암호화하고 상대가 진짜인지 확인하는 보안 포장이다. (우편 봉투와 보물상자 비유: 인증서 = 봉인/서명, 대칭키 암호화 = 속도 빠른 보물상자)

![08-03. HTTP-DNS-TLS SVG 인포그래픽](https://cs.chamung.com/public/wiki-assets/08-03-http-dns-tls-infographic.svg)
> 그림: 애니메이션 SVG 인포그래픽. HTTP-DNS-TLS, 학습 목적, 웹 통신 핵심 프로토콜의 역할을 정리한다의 관계와 문제 풀이 흐름을 한 장으로 잡는다.
> 출처: 내부 생성 자산 (`https://cs.chamung.com/public/wiki-assets/08-03-http-dns-tls-infographic.svg`)

## 실무/면접에서 자주 묻는 질문 (핵심 답안 요약)

- DNS 레코드 변경 후 바로 반영되지 않는 이유는? → TTL에 따라 캐시된 레코드가 만료될 때까지 갱신되지 않기 때문이다.
- HTTP와 HTTPS의 차이는? → HTTPS는 HTTP를 TLS로 감싼 것(암호화+인증). 포트 기본값은 HTTP 80, HTTPS 443.
- TLS 핸드셰이크에서 인증서 검증 과정은? → 서버가 제시한 인증서 체인을 루트 신뢰 저장소까지 검증(유효기간, 서명, 호스트 이름 확인, 폐지 여부 포함).
- HTTP/2와 HTTP/1.1의 가장 큰 차이는? → multiplexing(한 TCP 연결에서 여러 스트림 동시 전송)과 헤더 압축, 서버 푸시 지원.
- QUIC(HTTP/3)의 장점은? → UDP 기반으로 연결 재설정시 빠른 재개, 0-RTT/1-RTT 연결 성립 가능, TCP의 HOL(Head-of-line) 블로킹 문제 완화.


## 실습용 커맨드 예제 (면접 실무 시 데모로 사용 가능)

- DNS 조회 (dig)

```bash
# A 레코드 조회
dig example.com A

# 전체 경로 추적(root -> tld -> auth)
dig +trace example.com
```

- HTTP 요청 (curl)

```bash
# 간단 GET과 헤더 보기
curl -v https://example.com/

# 특정 HTTP 버전 강제 (예: HTTP/2)
curl --http2 -v https://example.com/

# 1초 이내 응답 시간 확인
curl -s -w "%{time_total}\n" -o /dev/null https://example.com/
```

- TLS 디버깅 (openssl)

```bash
# 서버 인증서와 교환되는 TLS 핸드셰이크 확인
openssl s_client -connect example.com:443 -servername example.com

# ALPN/프로토콜 협상, 증명서 체인, 만료일 확인에 유용
```

- 간단한 HTTP 요청/응답 예시

```http
GET /index.html HTTP/1.1
Host: example.com
Accept: text/html


HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1254

[응답 본문 예시는 생략]
```


## 트러블슈팅 포인트 (면접에서 설명할 수 있어야 함)

- DNS가 잘못된 경우: dig/nslookup으로 네임서버 응답 확인 → TTL/권한 네임서버가 올바른지, 레코드가 정확한지 확인.
- HTTPS 연결 실패: 인증서 유효성(날짜, 호스트명), 루트 인증서 신뢰, SNI 설정 여부, 지원 암호화 스위트 확인.
- 성능 문제: HTTP/1.1 연결 수 제한, TLS 핸드셰이크 비용(세션 재개 / 0-RTT), HTTP/2의 헤더 압축 비용(HPACK)과 CPU 영향 고려.
- 캐싱 문제: 캐시 무효화 전략(버전 관리, ETag, Cache-Control)을 사용해 배포 시 문제를 줄임.


## 면접용 체크리스트

- [ ] DNS의 A/AAAA/CNAME/MX/TXT/NS 의미를 설명할 수 있다.
- [ ] DNS 조회 흐름(root → tld → auth)과 TTL의 역할을 설명할 수 있다.
- [ ] HTTP 요청 구조(request line, headers, body)와 주요 메서드의 의도를 설명할 수 있다.
- [ ] HTTP 상태 코드 그룹(2xx, 3xx, 4xx, 5xx)과 자주 쓰이는 코드의 의미를 말할 수 있다.
- [ ] HTTP/1.1 vs HTTP/2 vs HTTP/3의 차이를 구조적/성능 관점에서 설명할 수 있다.
- [ ] TLS 핸드셰이크 단계, 인증서 체인, forward secrecy 개념을 설명할 수 있다.
- [ ] dig/curl/openssl 같은 도구로 문제를 진단하는 방법을 시연할 수 있다.


## 기출 연결
- [05-11-네트워크-기출-모음](05-11-네트워크-기출-모음.md)에 관련 문항을 색인한다.

## 약어 풀이

- DNS: Domain Name System, 도메인 이름 시스템
- HTTP: HyperText Transfer Protocol, 하이퍼텍스트 전송 프로토콜
- IP: Internet Protocol, 인터넷 프로토콜
- TLS: Transport Layer Security, 전송 계층 보안
- SNI: Server Name Indication, TLS 확장으로 하나의 IP에서 여러 인증서 사용 가능
- ALPN: Application-Layer Protocol Negotiation, TLS에서 애플리케이션 프로토콜(예: h2, http/1.1) 협상
- OCSP: Online Certificate Status Protocol, 인증서 폐지 확인 프로토콜
