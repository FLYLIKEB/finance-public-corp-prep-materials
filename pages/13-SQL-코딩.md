# 13. SQL/코딩

> 핵심: SQL 기본, JOIN, 서브쿼리, 구현, BFS/DFS, 코드 출력

## 학습 순서

- [13-01. SQL 기본](13-01-00-SQL-기본.md)
- [13-02. 구현](13-02-구현.md)
- [13-03. BFS-DFS](13-03-BFS-DFS.md)
- [13-04. 빈출 코드 출력 문제](13-04-빈출-코드-출력-문제.md)
![13. SQL/코딩 SVG 인포그래픽](https://cs.chamung.com/public/wiki-assets/13-sql-infographic.svg)
> 그림: SQL/코딩의 처리 단계를 순서대로 보여주는 SVG 인포그래픽.
> 출처: 내부 생성 자산 (`https://cs.chamung.com/public/wiki-assets/13-sql-infographic.svg`)

## 연결 핵심정리

- SQL 기본: SELECT/WHERE/GROUP BY/HAVING/ORDER BY의 목적과 실행 순서를 이해한다. NULL 처리, 집계 함수(AVG, SUM, COUNT 등)와 DISTINCT의 차이를 숙지한다. 특히 집계 결과와 비집계 열을 함께 사용할 때의 규칙(GROUP BY 필요성 등)을 반복 연습한다.
- JOIN과 서브쿼리: INNER/LEFT/RIGHT/FULL(가능한 경우)의 결과 차이를 손으로 그려 확인하고, 서브쿼리를 언제 IN/EXISTS/상관 서브쿼리로 바꾸는지 연습한다. 실제 데이터에서 NULL 값이 의미하는 바(데이터 없음 vs 명시적 NULL)를 의식하고 쿼리 조건에 반영하는 습관을 기른다.
- 구현 문제: 입력 파싱, 경계 케이스(빈 입력, 최대/최소값), 시간복잡도 고려. 예외/에러 처리와 로컬 테스트 케이스 작성 습관을 갖는다. 표준 입력/출력 형식부터 통과시키고, 이후 시간복잡도를 개선한다.
- BFS/DFS: 방문 배열(visited), 부모 추적(parent), 거리(dist) 관리 방법과 큐/스택의 동작을 코드로 익힌다. 순회 순서와 상태 변화를 손으로 추적해보고, 재귀 깊이 제한 때문에 발생할 수 있는 문제와 그 대체 방법(iterative stack)을 이해한다.
- 코드 출력: 포맷(줄바꿈, 공백, 소수점 자리) 규칙을 명확히 하고 예제 출력과 정확히 일치시키는 연습을 한다. 출력 형식이 조금이라도 다르면 채점 시스템에서 WA가 발생하므로, 포맷에 대한 자동화된 검증(예: 트리밍, 정규화)을 테스트해본다.

## 핵심 개념 (요점 정리)

- SELECT 실행(논리적) 순서(시험 포인트):
  1. FROM (테이블 결합과 소스 결정)
  2. WHERE (행 필터링)
  3. GROUP BY (그룹화)
  4. HAVING (그룹 필터링)
  5. SELECT (열 선택/계산)
  6. DISTINCT (중복 제거)
  7. ORDER BY (정렬)
  8. LIMIT/OFFSET (행 제한)

  이 순서는 쿼리를 해석할 때, 특히 서브쿼리나 집계가 섞인 경우 결과를 손으로 추적하는 핵심이다. 문제에서 특정 단계의 동작(예: HAVING이 GROUP BY 이후에 적용되는지)을 물어보면 이 순서를 근거로 답변한다.

- JOIN의 이해 포인트:
  - INNER JOIN: 양쪽에 모두 존재하는 행만 반환.
  - LEFT JOIN: 왼쪽 테이블의 모든 행 + 오른쪽 일치 행(없으면 NULL).
  - RIGHT JOIN: 오른쪽 테이블의 모든 행 + 왼쪽 일치 행(없으면 NULL).
  - CROSS JOIN: 데카르트 곱(조심해서 사용).
  - 실무 팁: WHERE 절에서 NULL 관련 조건을 잘못 쓰면 LEFT JOIN 의도와 다르게 동작한다. 예를 들어 LEFT JOIN 후 WHERE b.col = 'x'를 쓰면 b.col IS NULL인(매칭되지 않은) 행들이 걸러지고 결과가 INNER JOIN과 유사해질 수 있다.

- 서브쿼리와 연산자 선택:
  - IN: 작은 리스트 매칭에 유리(개념적으로 단순). 다만 NULL이 포함된 경우 동작을 주의.
  - EXISTS: 상관 서브쿼리에서 주로 사용. 서브쿼리가 조건을 만족하는 첫 행을 찾으면 true를 반환하기 때문에 경우에 따라 더 효율적일 수 있다.
  - 상관 서브쿼리: 외부 행에 의존하므로 외부 행 수만큼 서브쿼리가 실행될 수 있고, 성능 영향이 크다. 가능한 경우 조인으로 대체해 실행 횟를 줄이는 전략을 고려한다.

- BFS/DFS 핵심 체크리스트:
  - [ ] 방문 여부를 boolean으로 관리한다.
  - [ ] BFS는 큐(Queue), DFS는 스택(Stack) 또는 재귀 사용.
  - [ ] 거리(dist)나 레벨(level)이 필요한 문제는 BFS를 기본 고려.
  - [ ] 그래프의 연결 요소, 사이클 탐지, 최단 경로(비가중치) 등 문제 유형을 매칭.

## 시험 포인트 (빈출 문제 유형과 체크리스트)
![13. SQL/코딩 시험 체크리스트 SVG](https://cs.chamung.com/public/wiki-assets/13-sql-exam-checklist.svg)
> 그림: SQL, 구현, BFS/DFS, 출력 문제를 시험장에서 빠르게 점검할 수 있도록 분리한 체크리스트 SVG.
> 출처: 내부 생성 자산 (`https://cs.chamung.com/public/wiki-assets/13-sql-exam-checklist.svg`)

- SQL:
  - [ ] SELECT 실행 순서에 따라 쿼리 결과를 손으로 추적할 수 있다.
  - [ ] JOIN 종류별 예제 결과를 직접 도식화할 수 있다.
  - [ ] 그룹화 후 HAVING으로 조건을 걸어야 하는 상황을 구분할 수 있다(WHERE는 그룹화 이전, HAVING은 그룹화 이후 적용).
  - [ ] NULL 처리(특히 JOIN 결과의 NULL)로 인한 조건 차이를 설명할 수 있다.
  - [ ] 집계 함수 사용 시 DISTINCT, NULL 처리(예: COUNT(col) vs COUNT(*))의 차이를 이해한다.

- 구현:
  - [ ] 표준 입력/출력 형식에 맞춰 예외 케이스까지 처리한다.
  - [ ] 시간제한/메모리 한계를 고려한 알고리즘 선택(정렬, 해시, 투포인터 등).
  - [ ] 경계값(빈 데이터, 단일 요소, 최대 길이 등)에 대한 테스트 케이스를 직접 만들어 본다.

- BFS/DFS:
  - [ ] 큐/스택 상태와 방문 배열 변화를 예제에 대해 단계별로 적어볼 수 있다.
  - [ ] 재귀 깊이(DFS)와 스택 사용 시 overflow/limit 고려(실무에서 대체 구현 필요).

자주 나오는 구체적 문제 예시(연습 아이디어):
- 특정 조건을 만족하는 행들의 그룹별 집계와, 그 중 상위 K개 그룹만 추출하는 쿼리 구성 연습.
- LEFT JOIN 후 "매칭되지 않은" 왼쪽 행만 찾는 쿼리(b.value IS NULL)를 작성하고, 동일 결과를 NOT EXISTS로 바꿔보기.
- 그래프에서 최단 경로(비가중치)의 거리 계산 문제를 BFS로 구현하고, 중간 상태(큐, visited, dist)를 로그로 출력해 디버깅하기.

## 실무 연결 (면접/업무에서의 적용 포인트)

- 쿼리 최적화: 대용량 데이터에서는 JOIN 순서, 인덱스 사용, 서브쿼리 대신 조인으로 변환하는 전략이 중요하다. 쿼리의 실행 계획(EXPLAIN)을 보고 병목을 찾는 과정에 익숙해져야 한다. 실행 계획에서 주로 보는 항목은 테이블 스캔 여부, 인덱스 사용, 조인 순서, 예상 비용이다.
- 데이터 정합성 점검: 실무에서 LEFT JOIN 결과의 NULL 처리가 버그 원인이 되는 경우가 많다. NULL의 의미(데이터 없음 vs 명시적 NULL)를 논리적으로 구분하고, 쿼리 조건에서 이를 명시적으로 다루는 습관을 들인다(예: IS NULL/IS NOT NULL 조건 사용).
- 알고리즘 구현: 탐색 알고리즘(BFS/DFS)은 로그/트레이스, 네트워크 경로 분석, 의존성 그래프 탐색 등 실무 문제에 직접 적용된다. 재귀 호출 깊이가 문제될 경우 iterative 방식으로 변환하거나 명시적 스택을 사용해 안전하게 구현한다.
- 코드 품질: 면접/업무에서는 단순히 동작하는 코드보다 에지 케이스를 처리하고, 시간/메모리 복잡도를 고려한 클린한 구현을 더 높게 평가한다. 입력 검증, 명확한 변수명, 적절한 주석(간단한 목적 설명)은 기본이다.

## 연습 전략 (단계별)

1. SQL 기본 구문을 작성하고, 간단한 테이블(소규모 데이터)을 손으로 계산해본다. 각 단계(FROM→WHERE→GROUP BY→HAVING→SELECT)를 따로따로 시뮬레이션해본다.
2. JOIN별로 2~3개의 예제를 직접 만들고 결과를 도식화한다. NULL이 개입되는 경우와 아닌 경우를 모두 만들어 비교해 본다.
3. 집계와 그룹화가 섞인 쿼리를 직접 작성해보고, 동일한 결과를 서브쿼리로도 만들어 본다. 실행 계획을 확인할 수 있는 환경이면 간단히 비교해본다.
4. 구현 문제는 입출력부터 통과시키고, 그 다음 시간복잡도 개선을 한다. 초기에는 단순한 풀이로 작동을 확인한 뒤 최적화 단계를 적용한다.
5. BFS/DFS 문제는 상태(큐/스택, 방문 배열, 단계)를 출력해보며 디버깅한다. 재귀 방식이 문제를 일으키면 iterative로 바꾸어 본다.

## 간단한 예제 코드/쿼리 (참고용)

- SELECT 논리적 실행 순서 예시(SQL 문법 설명 목적):

```
-- FROM에서 테이블을 조합한 뒤 WHERE로 필터링, GROUP BY로 그룹화...
SELECT col1, COUNT(*)
FROM tableA
JOIN tableB ON tableA.id = tableB.a_id
WHERE tableA.status = 'active'
GROUP BY col1
HAVING COUNT(*) > 1
ORDER BY col1;
```

- LEFT JOIN에서 NULL 처리 예시(주의 포인트):

```
SELECT a.id, b.value
FROM A a
LEFT JOIN B b ON a.id = b.a_id
WHERE b.value IS NULL; -- 이는 b에 매칭되지 않은 A 행을 찾는다
```

설명: 위 쿼리는 A의 모든 행 중 B와 매칭이 없는(또는 B.value가 NULL인) 행을 골라낸다. 반대로 LEFT JOIN 후 WHERE b.value = 'x'를 쓰면 b.value가 NULL인 행들은 걸러져 결과가 INNER JOIN처럼 보일 수 있다.

- BFS/DFS 의사코드 예시 (Python 스타일):

```
# BFS
from collections import deque
q = deque([start])
visited[start] = True
dist[start] = 0
while q:
    node = q.popleft()
    for nei in adj[node]:
        if not visited[nei]:
            visited[nei] = True
            dist[nei] = dist[node] + 1
            q.append(nei)

# DFS (재귀)
def dfs(node):
    visited[node] = True
    for nei in adj[node]:
        if not visited[nei]:
            dfs(nei)

# DFS (iterative, 스택)
stack = [start]
visited[start] = True
while stack:
    node = stack.pop()
    for nei in adj[node]:
        if not visited[nei]:
            visited[nei] = True
            stack.append(nei)
```

기록/디버깅 팁: BFS에서는 큐의 상태와 dist 배열을, DFS에서는 재귀 호출 스택(또는 명시적 스택)의 상태를 출력해보면 문제를 이해하는 데 도움이 된다.

## 복습 포인트

- SQL은 SELECT 실행 순서와 JOIN 결과를 손으로 추적한다.
- 구현 문제는 입출력, 조건 분기, 반복문을 우선 안정화한다.
- BFS/DFS는 방문 배열과 큐/스택 상태를 추적한다.

## 약어 풀이

- BFS: Breadth-First Search, 너비 우선 탐색
- DFS: Depth-First Search, 깊이 우선 탐색
- JOIN: SQL 테이블 결합 연산
- SELECT: SQL 조회 명령
- SQL: Structured Query Language, 구조화 질의어

## 참고 연결 문서

- [04-2-프로그래밍-SQL-분산-클라우드](04-02-프로그래밍-SQL-분산-클라우드.md)


---

(이 문서는 원래 페이지의 구조와 상대 링크, 이미지 및 핵심 내용을 유지하면서 학습 친화적으로 개정한 것입니다.)