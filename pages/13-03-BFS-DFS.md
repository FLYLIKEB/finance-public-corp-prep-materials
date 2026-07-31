# 13-03. BFS-DFS

> 학습 목적: 그래프 탐색 코드의 방문 처리 위치를 정리한다.
> 관련 기출: [05-13-알고리즘-기출-모음](05-13-알고리즘-기출-모음.md)
> 연결 핵심정리: [04-2-프로그래밍-SQL-분산-클라우드](04-02-프로그래밍-SQL-분산-클라우드.md)

## 핵심 개념

- BFS는 큐를 사용한다.
- DFS는 재귀 또는 스택을 사용한다.
- 방문 처리는 중복 삽입과 무한 반복을 막기 위해 가능한 한 빠르게(탐색 후보를 자료구조에 넣을 때 또는 노드 방문 시점에) 수행한다.
- 그래프 표현은 인접리스트(권장), 인접행렬(노드 수가 작을 때) 등이 있다.

## 쉽게 이해하기

- BFS는 시작 노드에서부터 같은 거리에 있는 노드들을 먼저 모두 방문하는 탐색이다. "층(level)" 단위 탐색이 필요할 때(예: 최단경로, 최소 간선수) BFS를 사용한다.
- DFS는 한 방향으로 계속 깊게 들어가다가 더 이상 갈 곳이 없으면 한 단계씩 되돌아오는 탐색이다. 경로의 존재 여부, 모든 경로 탐색, 위상 정렬(DFS의 종료 시간 활용) 등에 자주 쓰인다.

![13-03. BFS-DFS SVG 인포그래픽](https://cs.chamung.com/public/wiki-assets/13-03-bfs-dfs-infographic.svg)
> 그림: 애니메이션 SVG 인포그래픽. BFS-DFS, 학습 목적, 관련 기출의 관계와 문제 풀이 흐름을 한 장으로 잡는다.
> 출처: 내부 생성 자산 (`https://cs.chamung.com/public/wiki-assets/13-03-bfs-dfs-infographic.svg`)
- 방문 처리를 언제 하는지가 중복 방문과 무한 반복을 막는 핵심이다. (아래 "방문 처리의 위치" 참고)


## 방문 처리의 위치(핵심)

- BFS
  - 일반적으로 이웃 노드를 큐에 넣을 때(enqueue할 때) 방문표시(visited = true)를 한다.
  - 이유: 큐에 같은 노드가 여러 번 들어가는 것을 막아 불필요한 중복과 계산을 피하기 위해서다.
  - 예외: 일부 구현에서는 큐에서 꺼낼 때(mark-on-dequeue) 방문표시를 할 수 있으나, 그 경우 같은 노드가 큐에 여러 번 들어갈 수 있음에 유의해야 한다.

- DFS
  - 재귀 구현: 함수를 호출(노드 진입)하는 시점에 방문표시를 한다 (pre-visit). 이 방법이 가장 직관적이며 중복 방문을 방지한다.
  - 반복(스택) 구현: 스택에 노드를 넣을 때(push할 때) 방문표시를 하는 것이 일반적이다. 이렇게 하면 스택에 같은 노드가 중복으로 쌓이는 것을 방지한다.
  - 단, DFS에서 일부 알고리즘(예: 모든 경로 탐색)에서는 방문표시를 탐색 경로 내에서만 유지하고 되돌아올 때 해제하는(backtracking) 방식이 필요하다.

요약: 일반적인 경우
- BFS: enqueue 시 방문표시
- DFS(재귀/스택): 진입(push/호출) 시 방문표시

## 시간·공간 복잡도 요약

| 알고리즘 | 시간 복잡도 | 추가 공간 복잡도 | 비고 |
|---|---:|---:|---|
| BFS (인접리스트) | O(V + E) | O(V) (큐 + visited) | 최단경로(비가중치) 보장 |
| DFS (인접리스트) | O(V + E) | O(V) (재귀 깊이 또는 스택 + visited) | 깊이 제한 시 재귀 스택 주의 |

- V: 정점 수, E: 간선 수
- 인접행렬을 쓰면 시간/공간이 더 커질 수 있음(O(V^2))

## 실무 연결 & 활용 예시

- 최단 경로(간선 가중치가 모두 동일한 경우): BFS
- 연결 요소 개수 세기(무향 그래프): BFS/DFS로 각 연결 컴포넌트를 순회
- 사이클 검출: DFS의 방문 상태(백엣지 확인)로 가능(유향/무향에서 처리 방식이 다름)
- 위상 정렬: DFS의 종료 시간(후위 순회) 활용
- 미로 탐색, 퍼즐(상태 공간 탐색): BFS(최단해), DFS(모든 경로 탐색 또는 깊이 우선 탐색)

실무 팁:
- 큰/깊은 그래프에서는 재귀 깊이 초과에 주의. 필요하면 iterative DFS로 변경하거나 재귀 한도를 늘리되 신중히.
- 그래프가 연결되어 있지 않다면 모든 노드(1..N)를 순회하면서 방문되지 않은 노드에서 BFS/DFS를 시작해야 함.

## 기출 연결
- [05-13-알고리즘-기출-모음](05-13-알고리즘-기출-모음.md)에 관련 문항을 색인한다.

## 문제 풀이 체크리스트 (면접/시험 포인트)

- 그래프 표현이 인접리스트인지 인접행렬인지 확인했는가?
- 방문 처리는 언제(mark-on-enqueue vs mark-on-dequeue vs pre-visit) 하고 있는가?
- 방문 배열(visited)을 노드마다 하나씩 잘 초기화했는가?
- 그래프가 연결 그래프인지 아닌지(Disconnected) 확인했는가? 모든 노드를 시작점으로 검사해야 할 수도 있다.
- 방향성(Directed)과 무향(Undirected)에 따라 사이클 판단/간선 처리 방법을 달리해야 한다.
- 시간 복잡도 O(V+E)를 만족하도록 구현했는가? 불필요한 중복 탐색은 없는가?

## 자주 나오는 실전/시험 문제 유형

- 최단경로(비가중치 그래프) — BFS
- 연결 요소의 개수 — BFS/DFS로 모든 정점 순회
- 특정 조건을 만족하는 노드까지의 최소 이동 횟수 — BFS
- 사이클 유무 판정 — DFS(방문 상태 3색 또는 parent 체크)
- 모든 경로 나열(백트래킹) — DFS(경로 탐색 중 visited 해제)

## 구현 예제 (Python)

- 그래프는 0..n-1 정점, 인접리스트로 가정

BFS (queue에 넣을 때 visited 체크):

```python
from collections import deque

def bfs(start, adj):
    n = len(adj)
    visited = [False] * n
    q = deque()
    visited[start] = True
    q.append(start)

    order = []  # 방문 순서
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True  # enqueue 시 방문 처리
                q.append(v)
    return order
```

DFS (재귀, 진입 시 방문 체크):

```python
def dfs_recursive(u, adj, visited, order=None):
    if order is None:
        order = []
    visited[u] = True  # 진입 시 방문 처리
    order.append(u)
    for v in adj[u]:
        if not visited[v]:
            dfs_recursive(v, adj, visited, order)
    return order

# 사용 예
# visited = [False] * n
# dfs_recursive(start, adj, visited)
```

반복적 DFS (스택, push 시 방문 체크):

```python
def dfs_iterative(start, adj):
    n = len(adj)
    visited = [False] * n
    stack = [start]
    visited[start] = True  # push 시 방문 처리
    order = []
    while stack:
        u = stack.pop()
        order.append(u)
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                stack.append(v)
    return order
```

주의: 위 반복 DFS는 인접 리스트의 이웃 순서에 따라 재방문 순서가 달라질 수 있음. 스택에 넣는 순서를 반대로 조정하면 재귀와 동일한 방문 순서를 얻을 수 있다.

## 주의사항(함정)

- 방문 체크를 늦게 하면(예: 큐/스택에서 꺼낸 뒤) 같은 노드가 자료구조에 중복으로 들어가 비효율을 초래할 수 있다.
- 깊이가 매우 큰 그래프에서 재귀 DFS를 그대로 쓰면 RecursionError가 발생할 수 있다.
- 무향 그래프에서 사이클을 검사할 때 부모 노드를 검사하지 않으면 즉시 사이클로 잘못 판정할 수 있다.

## 약어 풀이

- BFS: Breadth-First Search, 너비 우선 탐색
- DFS: Depth-First Search, 깊이 우선 탐색
- SQL: Structured Query Language, 구조화 질의어
