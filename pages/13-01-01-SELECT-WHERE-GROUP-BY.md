# 13-01-01. SELECT-WHERE-GROUP-BY

> 학습 목적: SQL 조회 기본 절을 손으로 해석한다.
> 관련 기출: [05-10-데이터베이스-기출-모음](05-10-데이터베이스-기출-모음.md)
> 연결 핵심정리: [04-2-프로그래밍-SQL-분산-클라우드](04-02-프로그래밍-SQL-분산-클라우드.md)

## 핵심 개념

- WHERE는 그룹화 전 조건이다.
- GROUP BY는 같은 값을 묶어 집계한다.
- HAVING은 그룹화 후 조건이다.

## 쉽게 이해하기

- WHERE는 개별 행을 걸러내는 체이고, GROUP BY는 남은 행을 묶는 바구니다.
- COUNT, SUM, AVG 같은 집계 함수는 그룹 단위로 계산할 때 자주 쓴다.
- HAVING은 그룹을 만든 뒤 그 그룹에 조건을 거는 절이다.

![SELECT 처리 흐름](https://raw.githubusercontent.com/FLYLIKEB/finance-public-corp-prep-materials/main/assets/downloaded-visual-aids/cloud-computing.svg)
> 그림: 클라우드 컴퓨팅 개념 기반으로 SELECT 처리 흐름 개념을 시각적으로 확인한다.
> 출처: https://commons.wikimedia.org/wiki/File:Cloud_computing.svg
## 기출 연결
- [05-10-데이터베이스-기출-모음](05-10-데이터베이스-기출-모음.md)에 관련 문항을 색인한다.

## 약어 풀이

- SELECT: SQL 조회 명령
- SQL: Structured Query Language, 구조화 질의어
