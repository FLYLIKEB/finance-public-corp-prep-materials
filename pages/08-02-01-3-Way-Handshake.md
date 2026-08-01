# 08-02-01. 3-Way-Handshake

> 학습 목적: TCP 연결 수립 과정을 단계별로 설명하고, 시험에서 자주 묻는 핵심 포인트를 정리한다.
> 관련 기출: [05-11-네트워크-기출-모음](05-11-네트워크-기출-모음.md)
> 연결 핵심정리: [04-4-네트워크-프로토콜-보안](04-04-네트워크-프로토콜-보안.md)

## 핵심 개념

- SYN은 연결 요청(Request)이다. 클라이언트가 서버에 새로운 연결을 열겠다는 신호로 보낸다.
- SYN-ACK는 요청 수락과 응답(Response)이다. 서버는 클라이언트의 SYN을 받고 자신의 SYN을 함께 보내며 클라이언트의 SYN을 수락했다는 ACK를 포함한다.
- ACK는 연결 확인(Confirmation)이며, 세 번째 패킷이 도달하면 양쪽 모두 연결이 성립되어 이후 데이터 전송이 시작된다.

## 단계별 동작(시험 대비 요약)

1. 클라이언트 -> 서버: SYN, Seq = x
   - 클라이언트는 초기 시퀀스 번호(ISN) x를 선택해 SYN 플래그가 설정된 세그먼트를 전송한다.
   - TCP 상태: 클라이언트는 CLOSED -> SYN-SENT 상태로 전환.

2. 서버 -> 클라이언트: SYN-ACK, Seq = y, ACK = x+1
   - 서버는 자신의 ISN y를 설정하고, 클라이언트의 시퀀스 번호에 대해 ACK(x+1)를 포함해 응답한다.
   - TCP 상태: 서버는 LISTEN -> SYN-RECEIVED 상태로 전환.

3. 클라이언트 -> 서버: ACK, Seq = x+1, ACK = y+1
   - 클라이언트는 서버의 ISN에 대해 ACK(y+1)를 보내 최종 확인을 한다.
   - 양측 모두 ESTABLISHED 상태가 되어 데이터 전송 가능.

![3-Way Handshake 흐름](https://cs.chamung.com/public/wiki-assets/08-02-01-3-way-handshake.gif)
코드 예시(개념적 표현):

```
# 1) 클라이언트 -> 서버
SYN, Seq = x

# 2) 서버 -> 클라이언트
SYN+ACK, Seq = y, ACK = x+1

# 3) 클라이언트 -> 서버
ACK, Seq = x+1, ACK = y+1
```

시험 포인트: 각 패킷의 Seq와 ACK 증감 규칙(x+1, y+1)을 정확히 기억하라. SYN 자체가 1바이트의 시퀀스 번호를 소비한다고 간주하여 ACK 번호가 ISN+1이 된다.

## 상태 변화(요약)

- 클라이언트 관점: CLOSED -> SYN-SENT -> ESTABLISHED
- 서버 관점: LISTEN -> SYN-RECEIVED -> ESTABLISHED

시험에서 묻는 방식: 특정 동작 후의 TCP 상태를 묻거나, 어느 쪽이 어떤 플래그를 설정했는지 묻는 문제가 자주 출제된다.

## 플래그 요약 표

| 플래그 | 의미 | 3-Way에서의 역할 |
|---|---:|---|
| SYN | 연결 요청/동기화 | 1번 패킷(요청)과 2번 패킷(응답에 포함)에서 사용 |
| ACK | 수신 확인 | 2번과 3번 패킷에서 사용하여 이전 패킷 확인 |

## 쉽게 이해하기(비유)

- 전화 연결로 비유하면: "여보세요?"(SYN) -> "네, 들립니다. 저도 통화 준비되었어요."(SYN-ACK) -> "좋습니다, 통화 시작합니다."(ACK)
- 이 3단계로 서로의 상태(수신 가능 여부, 초기 번호 동기화 등)를 맞춘다.

## 타이밍, 재전송, 예외 사례(시험에 자주 나오는 확장 지식)

- 재전송: SYN이나 SYN-ACK이 손실되면 송신자는 타이머(expiration)에 따라 재전송을 시도한다. 이 재전송 동작은 TCP의 신뢰성 메커니즘과 관련 있다.
- 동시 오픈(Simultaneous open): 양쪽에서 동시에 SYN을 보내는 경우 두 호스트가 서로 SYN을 받고 SYN-ACK 대신 SYN으로 응답하는 상황이 발생할 수 있으며, 결국 정상적으로 연결이 성립된다(시험에서는 예외 사례로 출제될 수 있음).
- 보안 문제: SYN 플러딩(SYN flood)은 공격자가 대량의 SYN을 보내 서버의 반개방 연결(half-open)을 쌓아 리소스를 소진시키는 DoS 기법이다. 방어로는 SYN 쿠키 등 기법이 사용된다(개념적 이해만 필요).

## 3-Way Handshake와 연결 종료 비교(짧게)

- 연결 수립: 3-Way Handshake (SYN, SYN-ACK, ACK)
- 연결 종료: 보통 4단계(FIN, ACK, FIN, ACK)로 이루어진다. 시험에서 수립과 종료를 혼동하지 않도록 주의.

![08-02-01. 재전송과 연결 종료 비교 SVG](https://cs.chamung.com/public/wiki-assets/08-02-01-tcp-retransmission-and-teardown.svg)
> 그림: SYN 또는 SYN-ACK 손실 시 재전송이 어떻게 반복되는지와, 연결 수립 3단계/연결 종료 4단계의 차이를 함께 정리한 SVG.
> 출처: 내부 생성 자산 (`https://cs.chamung.com/public/wiki-assets/08-02-01-tcp-retransmission-and-teardown.svg`)

## 기출 연결
- 관련 문제는 [05-11-네트워크-기출-모음](05-11-네트워크-기출-모음.md)에 색인되어 있다. 기출 문제를 풀며 Seq/ACK의 증감 규칙과 상태 전이를 반복 학습하라.

## 약어 풀이

- 3-Way: 3-Way Handshake, TCP 연결 수립을 위한 3단계 절차
- SYN: Synchronize, TCP 연결 동기화 플래그
- ACK: Acknowledgment, 수신 확인 플래그
- TCP: Transmission Control Protocol, 전송 제어 프로토콜

## 시험 대비 체크리스트

- [ ] SYN, SYN-ACK, ACK의 순서와 의미를 설명할 수 있다.
- [ ] 각 패킷의 Seq와 ACK가 어떻게 계산되는지(예: ISN+1) 설명할 수 있다.
- [ ] 클라이언트/서버 관점의 TCP 상태 변화를 말할 수 있다.
- [ ] SYN 플러딩 등 관련 보안 이슈의 개념을 간단히 설명할 수 있다.
- [ ] 연결 수립(3-way)과 연결 종료(4-way)를 구분할 수 있다.

## 연습 문제(단답/객관식 스타일)

1) 단답: 3-Way Handshake에서 두 번째 패킷(서버 -> 클라이언트)에 포함되는 주요 필드와 그 의미를 쓰시오.
   - 정답 예시: SYN과 ACK 플래그가 설정되고, Seq는 서버의 ISN, ACK는 클라이언트의 ISN+1을 포함한다.

2) 객관식: 클라이언트가 SYN을 보낸 직후의 TCP 상태는?
   - 보기: A) LISTEN B) SYN-SENT C) ESTABLISHED D) CLOSE_WAIT
   - 정답: B

3) 단답: 동일한 타이밍에 양쪽에서 SYN을 동시에 보냈을 때 발생할 수 있는 현상은?
   - 정답 예시: 동시 오픈(simultaneous open). 양쪽이 SYN을 수신하고 SYN-ACK 대신 SYN으로 응답하는 특수한 경우가 발생할 수 있다.

(모든 연습 문제의 해설은 Seq/ACK 규칙과 상태 전이를 기반으로 스스로 확인해 보라.)

![08-02-01. 3-Way-Handshake SVG 인포그래픽](https://cs.chamung.com/public/wiki-assets/08-02-01-3-way-handshake-infographic.svg)
> 그림: 3-Way-Handshake의 시간 흐름과 상태 변화를 좌→우 타임라인으로 보여주는 SVG 인포그래픽.
> 출처: 내부 생성 자산 (`https://cs.chamung.com/public/wiki-assets/08-02-01-3-way-handshake-infographic.svg`)
