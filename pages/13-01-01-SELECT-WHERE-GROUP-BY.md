# 13-01-01. SELECT-WHERE-GROUP-BY

> 학습 목적: SQL 조회 기본 절을 손으로 해석한다.
> 관련 기출: [05-10-데이터베이스-기출-모음](05-10-데이터베이스-기출-모음.md)
> 연결 핵심정리: [04-2-프로그래밍-SQL-분산-클라우드](04-02-프로그래밍-SQL-분산-클라우드.md)

## 핵심 개념

- WHERE는 그룹화 전 조건이다.
- GROUP BY는 같은 값을 묶어 집계한다.
- HAVING은 그룹화 후 조건이다.

## 실행(논리적) 순서 요약

SQL 문장이 실제로 '논리적'으로 평가되는 순서는 공부할 때 헷갈리기 쉬우므로 암기해 두면 유용합니다.

1. FROM (및 JOIN)
2. WHERE (행 필터링)
3. GROUP BY (그룹 생성)
4. HAVING (그룹 필터링)
5. SELECT (출력 컬럼 및 집계 계산)
6. ORDER BY
7. LIMIT / OFFSET

이 순서를 기억하면 WHERE와 HAVING의 차이점, 집계 함수의 동작 시점을 이해하기 쉬워집니다.

## 쉽게 이해하기

- WHERE는 개별 행을 걸러내는 체이고, GROUP BY는 남은 행을 묶는 바구니다.
- COUNT, SUM, AVG 같은 집계 함수는 그룹 단위로 계산할 때 자주 쓴다.
- HAVING은 그룹을 만든 뒤 그 그룹에 조건을 거는 절이다.

![SELECT 처리 흐름](https://raw.githubusercontent.com/FLYLIKEB/finance-public-corp-prep-materials/main/assets/downloaded-visual-aids/cloud-computing.svg)
> 그림: 클라우드 컴퓨팅 개념 기반으로 SELECT 처리 흐름 개념을 시각적으로 확인한다.
> 출처: https://commons.wikimedia.org/wiki/File:Cloud_computing.svg

## 규칙과 주의점 (핵심)

- SELECT 절에 집계 함수(예: COUNT, SUM 등)와 일반 컬럼을 섞어 쓸 때는 일반 컬럼이 GROUP BY에 포함되어야 합니다. 그렇지 않으면 SQL 표준에서는 오류가 발생하거나(엄격한 모드) DBMS마다 예측 불가능한 결과를 냅니다.
- WHERE는 NULL을 포함한 행을 제거할 수 있습니다. 예: WHERE col IS NOT NULL 을 통해 NULL을 배제한 뒤 그룹화하면 NULL이 없는 상태로 집계됩니다.
- HAVING은 그룹 단위로 평가되므로 집계 함수 결과를 조건으로 쓸 수 있습니다. 예: HAVING COUNT(*) > 1

## 실무 연결(성능과 작성 팁)

- 필터링은 가능한 한 먼저(WHERE) 수행해서 처리할 행 수를 줄이면 GROUP BY 수행 비용이 줄어듭니다.
- WHERE 절에 사용되는 컬럼에는 적절한 인덱스가 있으면 성능에 큰 도움이 됩니다. 하지만 GROUP BY 자체에 대해서는 인덱스가 항상 도움이 되지는 않습니다(집계 방식과 데이터 분포에 따라 다름).
- 대용량 데이터에서 GROUP BY로 인한 임시 정렬/해시 비용을 줄이려면 필요한 컬럼만 SELECT하고 WHERE로 사전 필터링하세요.

## 시험 포인트(기출 대비)

- WHERE는 그룹화 전 필터, HAVING은 그룹화 후 필터라는 문장을 보고 예시를 설명할 수 있어야 합니다.
- GROUP BY 사용 시 SELECT에 나타나는 컬럼 규칙을 정확히 설명하세요(집계가 아닌 컬럼은 GROUP BY에 포함).
- 집계 함수와 NULL의 관계: 예컨대 COUNT(col)은 NULL을 세지 않지만 COUNT(*)는 모든 행을 셉니다.
- 논리적 실행 순서(특히 WHERE와 HAVING의 위치)를 물을 수 있습니다.

## 자주 틀리는 항목

- HAVING을 WHERE 대신 쓰는 실수: HAVING은 집계 결과를 보고 필터링할 때만 사용해야 합니다. WHERE로 선필터링 가능한 조건을 HAVING으로 쓰면 비효율적이거나 잘못된 의도가 됩니다.
- GROUP BY에 모든 비집계 컬럼을 포함하지 않아도 된다고 잘못 알고 있는 경우: 일부 DBMS(예: MySQL의 non-strict 모드)는 허용하지만 표준 SQL에서는 허용되지 않습니다.

## NULL 처리 요약

- COUNT(col): col이 NULL인 행은 센다 제외
- COUNT(*): 모든 행을 센다
- SUM/AVG: NULL은 무시됨(집계 계산에서 제외)

## 예제와 연습 문제

다음 예제는 학습용 간단 테이블을 가정합니다.

예제 테이블: orders

| order_id | customer_id | amount | status   |
|----------|-------------|--------|----------|
| 1        | 100         | 10     | paid     |
| 2        | 101         | 20     | pending  |
| 3        | 100         | 15     | paid     |
| 4        | 102         | NULL   | cancelled|
| 5        | 101         | 5      | paid     |

- 1) 고객별 총 주문 금액을 구하되, 결제 상태가 paid인 주문만 포함:

```sql
SELECT customer_id, SUM(amount) AS total_paid
FROM orders
WHERE status = 'paid'
GROUP BY customer_id;
```

설명: WHERE로 paid인 행만 남긴 뒤 GROUP BY로 customer_id별로 합계 계산.

- 2) 고객별 주문 건수가 2건 이상인 고객만 조회:

```sql
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 2;
```

설명: GROUP BY로 고객별로 묶은 뒤 HAVING으로 그룹 필터링.

- 3) amount가 NULL인 행을 제외하고 고객별 평균 주문 금액을 구하기:

```sql
SELECT customer_id, AVG(amount) AS avg_amount
FROM orders
WHERE amount IS NOT NULL
GROUP BY customer_id;
```

설명: AVG는 NULL을 자동으로 무시하지만, WHERE로 NULL을 제외하면 불필요한 그룹 생성(예: NULL만 있는 그룹)을 막아줍니다.

- 연습문제(스스로 풀어보기):
  - 전체 고객 중 총 결제 금액이 가장 큰 상위 3명을 구하는 쿼리를 작성하세요.
  - 각 상태(status)별로 주문 건수와 총액을 구하되, 주문 건수가 1건 초과인 상태만 남기세요.

## 체크리스트 (학습 점검용)

- [ ] WHERE와 HAVING의 차이를 문장으로 설명할 수 있다.
- [ ] GROUP BY 사용 시 SELECT 절의 제한(비집계 컬럼은 GROUP BY 포함)을 설명할 수 있다.
- [ ] COUNT(col)과 COUNT(*)의 차이를 설명할 수 있다.
- [ ] 간단한 GROUP BY + HAVING 쿼리를 직접 작성해봤다.

## 기출 연결
- [05-10-데이터베이스-기출-모음](05-10-데이터베이스-기출-모음.md)에 관련 문항을 색인한다.

## 약어 풀이

- SELECT: SQL 조회 명령
- SQL: Structured Query Language, 구조화 질의어
