# 10-03-01. XSS-SQL-Injection

> 학습 목적: XSS와 SQL Injection의 공격 위치, 대표 패턴, 방어 방법을 구분한다.
> 관련 기출: [05-12-보안-기출-모음](05-12-보안-기출-모음.md)
> 연결 핵심정리: [04-4-네트워크-프로토콜-보안](04-04-네트워크-프로토콜-보안.md)

## 핵심 개념

- XSS(Cross-Site Scripting)는 웹 페이지에 악성 스크립트를 삽입해 사용자의 브라우저에서 실행시키는 공격이다.
- SQL Injection은 입력값에 SQL 구문을 주입해 인증 우회, 데이터 조회·변조·삭제를 시도하는 공격이다.
- XSS는 주로 **출력 인코딩·콘텐츠 보안 정책(CSP)·입력 검증**으로, SQL Injection은 **Prepared Statement·파라미터 바인딩**으로 방어한다.
![웹 공격 흐름](https://raw.githubusercontent.com/FLYLIKEB/finance-public-corp-prep-materials/main/assets/downloaded-visual-aids/client-server-model.svg)
> 그림: 클라이언트-서버 모델 기반으로 웹 공격 흐름 개념을 시각적으로 확인한다.
> 출처: https://commons.wikimedia.org/wiki/File:Client-server-model.svg

## XSS 원리

웹 애플리케이션이 사용자 입력을 HTML, JavaScript, URL, 속성 값에 그대로 출력하면 브라우저가 그 값을 코드로 해석할 수 있다. 공격자는 게시글, 검색어, 댓글, 프로필 값 등에 스크립트를 삽입해 다른 사용자의 쿠키 탈취, 세션 하이재킹, 피싱 페이지 유도, 악성 요청 전송을 노린다.

### XSS 종류

| 종류 | 실행 위치 | 특징 | 예시 |
| --- | --- | --- | --- |
| Reflected XSS | 요청 값이 즉시 응답에 반사 | 악성 링크 클릭 유도 | 검색어 `?q=<script>...</script>`가 결과 페이지에 그대로 출력 |
| Stored XSS | DB·게시판 등에 저장 후 출력 | 다수 사용자에게 반복 실행 | 게시글 본문에 스크립트 저장 |
| DOM XSS | 클라이언트 JavaScript가 DOM을 조작 | 서버 응답보다 브라우저 코드가 원인 | `location.hash` 값을 검증 없이 `innerHTML`에 삽입 |

### XSS 방어 방법

- 출력 위치별 인코딩: HTML 본문, HTML 속성, JavaScript 문자열, URL 문맥에 맞게 인코딩한다.
- 위험 API 지양: `innerHTML`, `eval`, 인라인 이벤트 핸들러 사용을 줄이고 안전한 DOM API를 사용한다.
- 입력 검증과 허용 목록: 허용 가능한 태그·속성·URL 스킴만 통과시킨다.
- 쿠키 보호: `HttpOnly`, `Secure`, `SameSite` 속성으로 세션 탈취 피해를 줄인다.
- CSP(Content Security Policy): 허용된 스크립트 출처를 제한해 스크립트 실행 가능성을 낮춘다.

## SQL Injection 원리

SQL Injection은 사용자 입력이 SQL 문자열에 직접 이어 붙을 때 발생한다. DBMS는 입력값과 명령문을 구분하지 못하고 공격자가 삽입한 SQL 조각을 실행할 수 있다.

```sql
-- 취약한 예
SELECT * FROM users WHERE id = '$id' AND pw = '$pw';

-- 공격 입력
id: admin' --
```

위 입력이 문자열 결합으로 들어가면 비밀번호 조건이 주석 처리되어 인증 우회가 가능해질 수 있다.

### SQL Injection 공격 패턴

| 패턴 | 목적 | 특징 |
| --- | --- | --- |
| 인증 우회 | 로그인 조건 무력화 | `' OR '1'='1` 같은 항상 참 조건 삽입 |
| UNION Injection | 다른 테이블 데이터 조회 | 컬럼 수와 타입을 맞춘 뒤 `UNION SELECT` 사용 |
| Error-based | 오류 메시지로 구조 추정 | DB 오류에 테이블명·컬럼명 단서가 노출 |
| Blind Injection | 참/거짓 반응으로 추론 | 화면 변화, 응답 시간 차이로 데이터 한 글자씩 추정 |
| Time-based Blind | 시간 지연 함수 이용 | `SLEEP`, `BENCHMARK` 등으로 조건 참 여부 확인 |

## SQL Injection 방어 방법

- Prepared Statement 사용: SQL 구조와 값이 분리되어 입력값이 명령으로 해석되지 않는다.
- 파라미터 바인딩: ORM이나 DB API의 바인딩 기능을 사용하고 문자열 결합을 피한다.
- 입력 검증: 숫자, 날짜, 코드 값처럼 형식이 정해진 값은 허용 목록으로 제한한다.
- 최소 권한: 애플리케이션 DB 계정에 필요한 권한만 부여해 피해 범위를 줄인다.
- 오류 메시지 통제: 상세 DB 오류를 사용자 화면에 노출하지 않는다.
- 저장 프로시저도 안전하게 작성: 프로시저 내부에서 동적 SQL 문자열 결합을 하면 여전히 취약하다.

## XSS와 SQL Injection 비교

| 구분 | XSS | SQL Injection |
| --- | --- | --- |
| 공격 대상 | 사용자 브라우저 | 데이터베이스 질의 |
| 주된 원인 | 출력 인코딩 실패, DOM 조작 취약점 | SQL 문자열 결합, 파라미터 미사용 |
| 대표 피해 | 쿠키 탈취, 세션 하이재킹, 피싱 | 인증 우회, 데이터 유출·변조·삭제 |
| 핵심 방어 | 출력 인코딩, CSP, 안전한 DOM API | Prepared Statement, 파라미터 바인딩 |

## 금융공기업 기출 연계 예시

1. **공격 위치 구분형**
   “게시판 댓글에 삽입된 스크립트가 다른 사용자의 브라우저에서 실행되었다” → Stored XSS.
2. **방어책 매칭형**
   SQL Injection의 가장 직접적인 방어책 → Prepared Statement 또는 파라미터 바인딩.
3. **Blind Injection 식별형**
   화면에 오류가 보이지 않아도 응답 시간이나 참/거짓 결과로 DB 값을 추정 → Blind SQL Injection.
4. **혼동 방지형**
   XSS는 브라우저에서 스크립트가 실행되는 문제이고, SQL Injection은 서버가 DB에 보내는 질의가 변조되는 문제다.

## 약어 풀이

- API: Application Programming Interface, 응용 프로그램 인터페이스
- DB: Database, 데이터베이스
- DOM: Document Object Model, 문서 객체 모델
- SELECT: SQL 조회 명령
- SQL: Structured Query Language, 구조화 질의어
- XSS: Cross-Site Scripting, 교차 사이트 스크립팅
