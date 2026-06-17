# 08-02-01. 3-Way-Handshake

> 학습 목적: TCP 연결 수립 과정을 단계별로 설명한다.
> 관련 기출: [05-11-네트워크-기출-모음](05-11-네트워크-기출-모음.md)
> 연결 핵심정리: [04-4-네트워크-프로토콜-보안](04-04-네트워크-프로토콜-보안.md)

## 핵심 개념

- SYN은 연결 요청이다.
- SYN-ACK는 요청 수락과 응답이다.
- ACK는 연결 확인이며 이후 데이터 전송이 시작된다.

## 쉽게 이해하기

- 3-Way Handshake는 전화를 걸 때 “여보세요?”, “네 들립니다”, “그럼 이야기 시작합니다”를 확인하는 과정과 비슷하다.
- SYN은 연결 요청, SYN-ACK는 요청 수락, ACK는 최종 확인이다.
- 이 과정을 거쳐야 TCP가 믿을 수 있는 통신을 시작한다.

![TCP 3-Way Handshake 흐름](https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/TCP_Three-Way_Handshake.svg/500px-TCP_Three-Way_Handshake.svg.png)
> 그림: TCP 연결 수립은 클라이언트의 SYN, 서버의 SYN-ACK, 클라이언트의 ACK 순서로 진행된다.
> 출처: Wikimedia Commons, https://commons.wikimedia.org/wiki/File:TCP_Three-Way_Handshake.svg

## 빈출 포인트

- 정의와 특징을 구분하는 객관식 문항
- 비슷한 개념 간 차이 비교
- 실제 기출 키워드와 연결한 빠른 복습

## 기출 연결
- [05-11-네트워크-기출-모음](05-11-네트워크-기출-모음.md)에 관련 문항을 색인한다.

## 오답 포인트

- 용어의 이름보다 적용 조건을 먼저 확인한다.
- 예외와 반례가 있는 선지를 주의한다.
- 계산형 주제는 중간 과정을 생략하지 않는다.

## 빠른 점검

- 핵심 정의를 한 문장으로 설명할 수 있는가?
- 비슷한 개념과 차이를 말할 수 있는가?
- 관련 기출 키워드를 바로 떠올릴 수 있는가?

## 약어 풀이

- 3-Way: 3-Way Handshake, TCP 연결 수립을 위한 3단계 절차
- SYN: Synchronize, TCP 연결 동기화 플래그
- TCP: Transmission Control Protocol, 전송 제어 프로토콜
