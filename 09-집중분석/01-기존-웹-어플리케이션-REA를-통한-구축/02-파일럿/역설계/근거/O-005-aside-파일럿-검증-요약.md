# O-005 — Aside 교차 검증: 파일럿 AC-A1 (P5)

날짜: 2026-10-20 · 도구: Aside CLI `exec` (격리 세션 `2026-10-20_Ieo9KYn6jncUZIqD`)
대상: 로컬 데모 파일럿 `http://127.0.0.1:5173/` (02-파일럿/frontend dev 서버)
근거 이미지: `O-005-aside-파일럿-로그인화면.png`, `O-005-aside-파일럿-결과안내.png`, `O-005-aside-파일럿-오류상태.png` (Aside 세션 `tmp/capture_login_errors.png` 보존)

## 지시 (요약)

"텍스트 이름·레이블·역할만으로 경로를 찾아 로그인 화면을 열고, 입력 요소를 식별하고, 빈 제출 오류 표시 위치·형태를 관찰하고, 데모 자격 증명(demouser/demopass)으로 로그인해 결과 문구를 읽고, URL과 스크린샷을 보고하라. vaatz.com 방문·다운로드 금지." (좌표·CSS 셀렉터 지시 없음 = AC-A1 조건)

## Aside 관측 사실 (Aside 세션 로그에서 확인)

1. **이름만으로 경로 발견**: `getByRole('button', {name:'로그인', exact:true})` 매칭 **1건** — 헤더 버튼 → `/login` 이동. (로그인 화면의 헤더에는 '로그인' 버튼이 렌더되지 않음도 관찰)
2. **입력 요소 식별**: label "아이디"(`for=userId`)·textbox `maxlength=10`, label "비밀번호"(`for=password`)·type=password `maxlength=20`, 버튼 텍스트 '로그인' `type=submit`, form action/method 없음(SPA). 헤더 안내 "이 화면은 데모입니다…"(`role=status`) 확인.
3. **빈 제출 오류**: URL 변화 없음, `/login` 유지. 인라인 오류 2건 `p.field-error[role=alert]` ("아이디를 입력하세요"/"비밀번호를 입력하세요"), 진한 빨강 텍스트·배너/토스트 없음, 입력에 `aria-invalid=true` + `aria-describedby=userId-error/password-error` 연결. Aside가 접근성 트리 DIFF로 직접 포착.
4. **데모 로그인 결과**: 오류 2건 소멸(alert 0), 새 `role=status` 안내 "이 파일럿은 인증을 수행하지 않습니다. 로그인 성공·OTP·업무 데이터가 이어지지 않습니다."(노란 배경). 화면 이동 없음. 메인으로 돌아가자 헤더 '로그인' 버튼 그대로 → 세션/인증 상태 변화 없음.
5. **URL 보고**: main `/`, 로그인·오류·결과 상태 모두 `/login` 유지 (클라이언트 상태만 변경).

## 독립 검증 (Aside 보고만으로는 확정하지 않음)

| Aside 주장 | 독립 확인 경로 | 결과 |
|---|---|---|
| 헤더 '로그인' 이름 1건 매칭 → `/login` | 자동 E2E #1 (`getByRole` 텍스트 버튼)·#2 직접 GET | 일치 |
| maxlength 10/20·label 연결 | 단위 테스트(validator 6 + 화면 5)·E2E #5 경계 | 일치 |
| 빈 제출 → 인라인 alert 2건 + aria-invalid | E2E #3 "빈 제출은 alert이 아닌 인라인 오류 표시" (해당 명명: 전역 alert 없음) | 일치 |
| 결과 안내 문구·인증 미수행·alert 0 | E2E #6 (인증 네트워크 요청 0건) + 단위 테스트 status 확인 | 일치 |
| 뒤로 main 복귀 시 세션 변화 없음 | E2E #7 뒤로 가기 `/` 복귀 | 일치 |

**AC-A1 판정: 충족.** Aside는 좌표·셀렉터 지시 없이 접근성 이름과 레이블만으로 경로를 발견·진입·입력 식별·결과 판독에 성공했다. 모든 주장이 자동 테스트(E2E 7/7)와 설계 §4 규칙에 독립 재확인됐다.

## 한계·학습 (사실로 기록)

- Aside의 접근성 트리 텍스트는 DOM 파생이라 셀렉터·스크린샷과 별개로 확인 가능했지만, Aside 세션 내부 이미지는 에이전트가 직접 볼 수 없어 근거 이미지로 별도 보존 필요(O-004와 같은 절차).
- Aside가 비밀번호 값을 로그에서 `[redacted]`로 자체 마스킹 — 관찰 안전 원칙과 정합.
- Aside 보고에 없는 항목(네트워크 요청 수)은 독립 경로(E2E request 필터)로 보완 — Aside 단독 증거 금지 원칙 유지.
