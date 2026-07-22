# 10-03-01. XSS-SQL-Injection

> 학습 목적: XSS와 SQL Injection의 공격 위치, 대표 패턴, 방어 방법을 구분한다.
> 관련 기출: [05-12-보안-기출-모음](05-12-보안-기출-모음.md)
> 연결 핵심정리: [04-4-네트워크-프로토콜-보안](04-04-네트워크-프로토콜-보안.md)

## 핵심 개념

- XSS(Cross-Site Scripting)는 웹 페이지에 악성 스크립트를 삽입해 사용자의 브라우저에서 실행시키는 공격이다. 주된 목표는 사용자 세션·쿠키 탈취, 사용자에 대한 사회공학(피싱) 유도, 또는 사용자를 대신한 악성 요청 전송이다.
- SQL Injection은 입력값에 SQL 구문을 주입해 인증 우회, 데이터 조회·변조·삭제를 시도하는 공격이다. 애플리케이션이 SQL 명령문과 입력값을 구분하지 못할 때 발생한다.
- 방어 요약:
  - XSS: 출력 인코딩(문맥별), 안전한 DOM API 사용, CSP, 입력 허용목록(whitelist)
  - SQL Injection: Prepared Statement/파라미터 바인딩, 입력 검증(타입·범위), 최소 권한 원칙

![웹 공격 흐름](https://raw.githubusercontent.com/FLYLIKEB/finance-public-corp-prep-materials/main/assets/downloaded-visual-aids/client-server-model.svg)
> 그림: 클라이언트-서버 모델 기반으로 웹 공격 흐름 개념을 시각적으로 확인한다.
> 출처: https://commons.wikimedia.org/wiki/File:Client-server-model.svg

## XSS 원리

웹 애플리케이션이 사용자 입력을 HTML, JavaScript, URL, 속성 값에 그대로 출력하면 브라우저가 그 값을 코드로 해석할 수 있다. 공격자는 게시글, 검색어, 댓글, 프로필 값 등에 스크립트를 삽입해 다른 사용자의 브라우저에서 실행되도록 유도한다.

### XSS 종류

| 종류 | 실행 위치 | 특징 | 예시 |
| --- | --- | --- | --- |
| Reflected XSS | 요청 값이 즉시 응답에 반사 | 악성 링크 클릭 유도, 일회성 공격이 흔함 | 검색어 `?q=&lt;script&gt;...&lt;/script&gt;`가 결과 페이지에 그대로 출력 |
| Stored XSS | DB·게시판 등에 저장 후 출력 | 다수 사용자에게 반복 실행, 피해 파급력 큼 | 게시글 본문에 스크립트 저장 후 다른 사용자가 열람 시 실행 |
| DOM XSS | 클라이언트 JavaScript가 DOM을 조작 | 서버 응답보다 브라우저 코드가 원인, URL 프래그먼트·location 사용 | `location.hash` 값을 검증 없이 `innerHTML`에 삽입 |

시험 포인트: 문장에서 "다른 사용자의 브라우저에서 스크립트가 실행"이라고 하면 Stored XSS를 의심하고, "링크 클릭 시 즉시 반사"라고 하면 Reflected XSS를 의심한다. "DOM 조작 또는 location/hash 관련"이면 DOM XSS를 떠올리자.

### XSS 방어 방법 (구체적 실무 지침)

- 문맥별 출력 인코딩
  - HTML 본문: `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`, `"` → `&quot;` 등으로 이스케이프
  - HTML 속성: 속성 값에는 따옴표 이스케이프와 추가 검증 필요
  - JavaScript 문자열: 값이 JS 문자열에 들어갈 경우 이스케이프 처리 또는 문자열 바인딩 방식 사용
  - URL 문맥: URL 인코딩을 사용하고 허용된 스킴만 허용
- 위험 API 지양
  - innerHTML, document.write(), eval(), new Function(), inline event handlers(onclick=...) 사용 최소화
  - DOM 삽입 시 textContent, setAttribute, createElement 등 안전한 API 사용
    - 예: element.textContent = userInput; // 사용자가 입력한 문자열을 그대로 텍스트로 삽입
- 입력 검증과 허용 목록(whitelist)
  - 허용되는 태그·속성·URL 스킴(예: http, https, mailto)만 통과
  - 태그 허용 시 HTML sanitizer(whitelisting 기반)를 적용
- 쿠키 보호
  - Set-Cookie: session=...; HttpOnly; Secure; SameSite=Strict/ Lax
  - HttpOnly는 JS에서 쿠키 접근을 막아 XSS로 인한 세션 탈취 위험을 줄임
- CSP(Content Security Policy)
  - 외부 스크립트/인라인 스크립트 실행을 제한. 예시(서버 응답 헤더):

    Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-<random>'

  - CSP는 완전한 해결책이 아니므로 인코딩·입력 검증과 병행해야 함

## SQL Injection 원리

애플리케이션이 동적으로 생성한 SQL 문자열에 사용자가 입력한 값을 그대로 결합하면, DBMS는 입력값을 쿼리 구조의 일부로 해석할 수 있다. 결과적으로 의도하지 않은 추가 쿼리나 조건 변경이 발생한다.

```sql
-- 취약한 예 (문자열 결합)
SELECT * FROM users WHERE id = '$id' AND pw = '$pw';

-- 공격 입력 예시
id: admin' --
```

위처럼 입력값에 따옴표(`'`)와 주석문자(`--`)가 포함되면 본래 조건이 무력화될 수 있다.

### SQL Injection 공격 패턴

| 패턴 | 목적 | 특징 |
| --- | --- | --- |
| 인증 우회 | 로그인 조건 무력화 | `' OR '1'='1` 같은 항상 참 조건 삽입 |
| UNION Injection | 다른 테이블 데이터 조회 | `UNION SELECT`로 추가 컬럼 데이터 병합, 컬럼 수/타입 맞춤 필요 |
| Error-based | 오류 메시지로 구조 추정 | DB 오류 메시지에 테이블명·컬럼명 단서가 노출될 수 있음 |
| Blind Injection | 참/거짓 반응으로 추론 | 화면 변화나 응답 시간 차이로 한 글자씩 데이터 추정(화면에 출력 없음) |
| Time-based Blind | 시간 지연 함수 이용 | `SLEEP` 또는 DB별 지연 함수를 이용해 조건 참 여부 판별 |

시험 포인트: 문제에서 "오류 메시지에 정보가 드러남"이면 Error-based, "응답 내용이 같고 시간/반응으로 판단"이면 Blind형을 떠올리자.

## SQL Injection 방어 방법 (구체적 실무 지침)

- Prepared Statement/Parameterized Query 사용 (가장 권장)
  - 애플리케이션 언어에서 쿼리 구조와 값을 분리. 예시:

    Java/JDBC:

    ```java
    String sql = "SELECT * FROM users WHERE id = ? AND pw = ?";
    PreparedStatement ps = conn.prepareStatement(sql);
    ps.setString(1, id);
    ps.setString(2, pw);
    ResultSet rs = ps.executeQuery();
    ```

    Python (psycopg2, MySQLdb 등):

    ```python
    cursor.execute("SELECT * FROM users WHERE id = %s AND pw = %s", (id, pw))
    ```

- ORM 사용 시에도 내부적으로 파라미터 바인딩을 사용하는지 확인하고, 원시 SQL을 직접 작성할 때는 파라미터화된 API를 사용
- 입력 검증 및 타입 체크
  - 숫자형, 날짜형, 고정 코드값 등은 형식·범위를 엄격히 검증
  - 허용목록(whitelist)을 우선 적용. 블랙리스트는 우회가 쉬움
- 최소 권한 원칙
  - 애플리케이션 DB 계정에 읽기/쓰기/DDL 등의 권한을 최소한으로 부여하여 피해 범위를 제한
- 오류 메시지 통제
  - 내부 DB 오류를 사용자에게 노출하지 않도록 로깅과 사용자 응답을 분리
- 저장 프로시저 주의
  - 저장 프로시저 자체가 자동으로 안전한 것은 아님. 내부에서 동적 SQL을 문자열 결합하면 취약

## 취약점 탐지·검증(실무 팁)

- XSS 테스트 기본 페이로드: `&lt;script&gt;alert(1)&lt;/script&gt;`, `" onerror="alert(1)` 등(간단한 반응 확인용)
- SQLi 테스트 기본 페이로드: `' OR '1'='1`, `" OR 1=1 --` 같은 기본 패턴으로 인증 우회 시도
- 자동화 도구(취약점 스캐너)와 수동 검증 병행
  - 자동화는 범위를 빠르게 확인, 수동은 논리적 흐름(예: DOM XSS)과 권한 상승 가능성 확인에 필요
- 로그·응답·DB 권한 확인
  - 공격 성공 시 어떤 로그가 남는지, DB 계정 권한으로 어떤 작업이 가능한지 파악

(주의) 교육·방어 목적 이외의 악용을 위한 상세 익스플로잇 작성이나 공격 자동화 방법은 이 문서의 범위를 벗어난다. 여기서는 방어와 식별에 필요한 핵심 개념과 안전한 구현 예시를 제공한다.

## XSS와 SQL Injection 비교

| 구분 | XSS | SQL Injection |
| --- | --- | --- |
| 공격 대상 | 사용자 브라우저 (클라이언트 측) | 데이터베이스 질의 (서버 측) |
| 주된 원인 | 출력 인코딩 실패, DOM 조작 취약점 | SQL 문자열 결합, 파라미터 미사용 |
| 대표 피해 | 쿠키 탈취, 세션 하이재킹, 피싱, CSRF 연계 | 인증 우회, 데이터 유출·변조·삭제, 권한 상승 |
| 핵심 방어 | 출력 인코딩, CSP, 안전한 DOM API, 쿠키 속성 | Prepared Statement, 파라미터 바인딩, 입력 검증, 최소 권한 |

실무 연결: XSS 취약점은 사용자 신뢰를 무너뜨리고 CS 환경에서 추가적인 악성 행위를 유발할 수 있어 프론트엔드·백엔드 협업으로 해결해야 한다. SQL Injection은 주로 백엔드·DB 설계의 문제로, 데이터 보안·접근 제어와 연계해 방어하는 것이 중요하다.

## 금융공기업 기출 연계 예시 (확장)

1. 공격 위치 구분형
   - 문제: “게시판 댓글에 삽입된 스크립트가 다른 사용자의 브라우저에서 실행되었다”
   - 해석: Stored XSS (데이터가 서버측에 저장되어 다른 사용자가 접근할 때 실행)

2. 방어책 매칭형
   - 문제: "SQL Injection의 가장 직접적인 방어책은?"
   - 정답 포인트: Prepared Statement 또는 파라미터 바인딩(문자열 결합 금지)

3. Blind Injection 식별형
   - 문제: "화면에 오류가 보이지 않지만 응답 시간이나 참/거짓 결과로 DB 값을 추정했다"
   - 해석: Blind SQL Injection (특히 Time-based Blind 가능성 있음)

4. 혼동 방지형
   - 핵심 구분: XSS는 브라우저에서 스크립트가 실행되는 문제(클라이언트 영향), SQL Injection은 서버에서 DB로 전송되는 질의가 조작되는 문제(데이터·서버 영향)

추가 시험 팁:
- 정답을 고를 때 “출력 시점/실행 위치(브라우저 vs DB)”를 기준으로 분류하면 실수가 줄어든다.
- 방어 항목 매칭 문제에서는 ‘문맥별 인코딩’과 ‘파라미터 바인딩’을 핵심어로 기억하자.

## 약어 풀이

- API: Application Programming Interface, 응용 프로그램 인터페이스
- DB: Database, 데이터베이스
- DOM: Document Object Model, 문서 객체 모델
- SELECT: SQL 조회 명령
- SQL: Structured Query Language, 구조화 질의어
- XSS: Cross-Site Scripting, 교차 사이트 스크립팅

---

참고: 본 문서는 학습·방어 관점에서 핵심 개념과 실무 적용 팁을 정리한 것이다. 실제 환경에서 취약점 점검 시에는 조직의 보안 정책과 법적 요건을 준수해야 한다.