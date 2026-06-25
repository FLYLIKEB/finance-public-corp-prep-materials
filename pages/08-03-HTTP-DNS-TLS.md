# 08-03. HTTP-DNS-TLS

> 학습 목적: 웹 통신 핵심 프로토콜의 역할을 정리한다.
> 관련 기출: [05-11-네트워크-기출-모음](05-11-네트워크-기출-모음.md)
> 연결 핵심정리: [04-4-네트워크-프로토콜-보안](04-04-네트워크-프로토콜-보안.md)

## 핵심 개념

- HTTP는 웹 요청과 응답 프로토콜이다.
- DNS는 도메인 이름을 IP 주소로 변환한다.
- TLS는 암호화와 인증으로 통신을 보호한다.


### 서술형 확장 개념

- DNS 조회는 stub resolver가 recursive resolver에 요청하고, resolver가 root → TLD → authoritative name server를 따라가며 답을 찾는 구조다. TTL은 캐시 유지 시간을 정하며, A/AAAA는 주소, CNAME은 별칭, MX는 메일 서버, TXT는 검증·정책 정보를 담는다.
- HTTP는 method와 status code로 의미를 표현한다. GET은 조회, POST는 생성/처리 요청, PUT/PATCH는 갱신, DELETE는 삭제 의미가 강하며, 2xx는 성공, 3xx는 리다이렉션, 4xx는 클라이언트 오류, 5xx는 서버 오류다.
- HTTP/1.1은 연결 재사용과 pipelining을 제공하지만 head-of-line blocking 문제가 있고, HTTP/2는 multiplexing과 header compression을 제공한다. HTTP/3는 QUIC 위에서 동작해 TCP 수준의 head-of-line blocking을 줄인다.
- TLS handshake는 서버 인증서 검증 후 공개키 기반 절차로 세션 키를 합의하고, 실제 데이터는 빠른 대칭키 암호로 보호한다. 즉 TLS는 공개키 암호와 대칭키 암호를 함께 쓰는 하이브리드 구조다.

## 쉽게 이해하기

- DNS는 전화번호부처럼 도메인 이름을 IP 주소로 바꿔 준다.
- HTTP는 웹브라우저와 서버가 요청과 응답을 주고받는 대화 규칙이다.
- TLS는 그 대화를 암호화하고 상대가 진짜인지 확인하는 보안 포장이다.

![웹 접속 흐름](https://raw.githubusercontent.com/FLYLIKEB/finance-public-corp-prep-materials/main/assets/downloaded-visual-aids/client-server-model.svg)
> 그림: 클라이언트-서버 모델 기반으로 웹 접속 흐름 개념을 시각적으로 확인한다.
> 출처: https://commons.wikimedia.org/wiki/File:Client-server-model.svg
## 기출 연결
- [05-11-네트워크-기출-모음](05-11-네트워크-기출-모음.md)에 관련 문항을 색인한다.

## 약어 풀이

- DNS: Domain Name System, 도메인 이름 시스템
- HTTP: HyperText Transfer Protocol, 하이퍼텍스트 전송 프로토콜
- IP: Internet Protocol, 인터넷 프로토콜
- TLS: Transport Layer Security, 전송 계층 보안
