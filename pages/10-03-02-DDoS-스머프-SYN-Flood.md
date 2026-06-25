# 10-03-02. DDoS-스머프-SYN-Flood

> 학습 목적: 가용성을 침해하는 네트워크 공격을 비교한다.
> 관련 기출: [05-12-보안-기출-모음](05-12-보안-기출-모음.md)
> 연결 핵심정리: [04-4-네트워크-프로토콜-보안](04-04-네트워크-프로토콜-보안.md)

## 핵심 개념

- DDoS는 다수 장비로 대량 트래픽을 보낸다.
- 스머프 공격은 증폭을 이용한다.
- SYN Flood는 TCP 연결 대기 자원을 고갈시킨다.

## 쉽게 이해하기

- DDoS는 많은 사람이 한 매장에 동시에 몰려 정상 손님이 들어오지 못하게 만드는 상황과 비슷하다.
- 스머프 공격은 다른 장비들을 이용해 공격 트래픽을 증폭시키는 방식이다.
- SYN Flood는 TCP 연결 요청만 많이 보내 서버가 대기 상태 자원을 낭비하게 만든다.

![DDoS·SYN Flood](https://raw.githubusercontent.com/FLYLIKEB/finance-public-corp-prep-materials/main/assets/downloaded-visual-aids/client-server-model.svg)
> 그림: 클라이언트-서버 모델 기반으로 DDoS·SYN Flood 개념을 시각적으로 확인한다.
> 출처: https://commons.wikimedia.org/wiki/File:Client-server-model.svg
## 기출 연결
- [05-12-보안-기출-모음](05-12-보안-기출-모음.md)에 관련 문항을 색인한다.

## 약어 풀이

- DDoS: Distributed Denial of Service, 분산 서비스 거부 공격
- SYN: Synchronize, TCP 연결 동기화 플래그
- TCP: Transmission Control Protocol, 전송 제어 프로토콜
