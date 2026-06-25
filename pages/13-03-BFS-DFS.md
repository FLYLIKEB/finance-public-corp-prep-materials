# 13-03. BFS-DFS

> 학습 목적: 그래프 탐색 코드의 방문 처리 위치를 정리한다.
> 관련 기출: [05-13-알고리즘-기출-모음](05-13-알고리즘-기출-모음.md)
> 연결 핵심정리: [04-2-프로그래밍-SQL-분산-클라우드](04-02-프로그래밍-SQL-분산-클라우드.md)

## 핵심 개념

- BFS는 큐를 사용한다.
- DFS는 재귀 또는 스택을 사용한다.
- 방문 처리는 중복 삽입을 막기 위해 빠르게 수행한다.

## 쉽게 이해하기

- BFS는 가까운 곳부터 차례대로 방문하는 탐색이다. 큐에 다음 후보를 넣고 앞에서부터 꺼낸다.
- DFS는 한 방향으로 깊게 들어가다가 막히면 돌아오는 탐색이다. 재귀나 스택으로 구현한다.

![DFS 깊이 우선 탐색 애니메이션](https://raw.githubusercontent.com/FLYLIKEB/finance-public-corp-prep-materials/main/assets/downloaded-visual-aids/dfs-animation.gif)
> 그림: DFS 깊이 우선 탐색 애니메이션 기반으로 DFS 구현 개념을 시각적으로 확인한다.
> 출처: https://commons.wikimedia.org/wiki/File:Depth-First-Search.gif
- 방문 처리를 언제 하는지가 중복 방문과 무한 반복을 막는 핵심이다.

![DFS와 BFS](https://raw.githubusercontent.com/FLYLIKEB/finance-public-corp-prep-materials/main/assets/downloaded-visual-aids/bfs-animation.gif)
> 그림: BFS 탐색 애니메이션 기반으로 DFS와 BFS 개념을 시각적으로 확인한다.
> 출처: https://commons.wikimedia.org/wiki/File:Breadth-First-Search-Algorithm.gif
## 기출 연결
- [05-13-알고리즘-기출-모음](05-13-알고리즘-기출-모음.md)에 관련 문항을 색인한다.

## 약어 풀이

- BFS: Breadth-First Search, 너비 우선 탐색
- DFS: Depth-First Search, 깊이 우선 탐색
- SQL: Structured Query Language, 구조화 질의어
