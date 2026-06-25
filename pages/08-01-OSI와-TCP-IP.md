# 08-01. OSI와 TCP-IP

> 학습 목적: OSI 7계층과 TCP/IP 계층을 대응한다.
> 관련 기출: [05-11-네트워크-기출-모음](05-11-네트워크-기출-모음.md)
> 연결 핵심정리: [04-4-네트워크-프로토콜-보안](04-04-네트워크-프로토콜-보안.md)

## 핵심 개념

- OSI는 물리, 데이터링크, 네트워크, 전송, 세션, 표현, 응용 계층이다.
- TCP/IP는 네트워크 접근, 인터넷, 전송, 응용 계층으로 본다.
- 계층별 대표 프로토콜을 함께 암기한다.


### 서술형 확장 개념

- 데이터링크 계층은 같은 링크 안에서 프레임을 전달하며 MAC 주소, Ethernet, CRC 오류 검출, 스위치의 MAC table 학습과 연결된다. ARP는 IP 주소를 MAC 주소로 변환해 IP 패킷을 실제 링크 프레임에 실을 수 있게 한다.
- 네트워크 계층은 IP 주소를 기준으로 다른 네트워크까지 패킷을 전달한다. IPv4 헤더의 TTL은 라우팅 루프를 방지하고, ICMP는 오류 보고와 진단(ping/traceroute)에 사용되며, NAT는 사설 IP와 공인 IP 변환을 담당한다.
- DHCP는 단말에 IP, gateway, DNS 정보를 동적으로 할당한다. 데이터통신 서술형에서는 “주소 단위”를 구분하면 계층 답안이 명확해진다.

| 계층 | 주소/단위 | 장비·프로토콜 예시 |
| --- | --- | --- |
| 데이터링크 | MAC / frame | Ethernet, switch, ARP, CRC |
| 네트워크 | IP / packet | IP, ICMP, router, NAT, DHCP |
| 전송 | Port / segment·datagram | TCP, UDP |
| 응용 | URL·도메인·메시지 | HTTP, DNS, SMTP, TLS |

## 쉽게 이해하기

- OSI 계층은 네트워크 통신 과정을 역할별로 나눈 설명서다. 아래 계층은 실제 전송에 가깝고, 위 계층은 사용자가 보는 서비스에 가깝다.
- 편지를 보낼 때 내용 작성, 봉투 포장, 주소 작성, 배달이 나뉘는 것처럼 네트워크도 계층별 역할이 있다.
- 시험에서는 각 계층의 대표 장비와 프로토콜을 연결하는 문제가 자주 나온다.

![OSI 7계층 구조](https://raw.githubusercontent.com/FLYLIKEB/finance-public-corp-prep-materials/main/assets/downloaded-visual-aids/osi-model.png)
> 그림: OSI 7계층 구조 기반으로 OSI 7계층 구조 개념을 시각적으로 확인한다.
> 출처: https://commons.wikimedia.org/wiki/File:OSI_Model_v1.svg

## 기출 연결
- [05-11-네트워크-기출-모음](05-11-네트워크-기출-모음.md)에 관련 문항을 색인한다.

## 약어 풀이

- IP: Internet Protocol, 인터넷 프로토콜
- OSI: Open Systems Interconnection, 개방형 시스템 상호연결
- TCP: Transmission Control Protocol, 전송 제어 프로토콜
