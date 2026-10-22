# O-002 근거 요약 — viewLogin.do (로그인 초기 화면)

- 관찰 시각: 2026-10-20 (KST) · 도구: `mcp__rea__capture_browser_scenario` (headless, `btnLogin` 클릭 → 전환 관찰; 입력·제출 없음)
- 경로: main.do → `click(css img#btnLogin)` → `https://www.vaatz.com/vmp/common/login/viewLogin.do` (navigation entry type=navigate, history length 3)
- Evidence ID: `ev_171a129f657b5384a532e952c120414861905a4786d411f1e0a0f6a887b2a45e`
- completeness: complete · 이벤트 1건만: `ReferenceError: closeWin is not defined at onunload (popupMasterOpen.do:67)`
- 저장 상태: 쿠키·localStorage·sessionStorage 캡처 없음(청정 세션, 값 비보관)

## 관찰 사실 — 전환 메커니즘

- `jsLoginRedirect()`(인라인): 동적 `<form id="form_common_loginRedirect">` 생성 → `method=post`, `action=/vmp/common/login/viewLogin.do`, hidden `strRtnVoReset=Y` → `f.submit()`. 즉 **JavaScript POST 폼 submit** 방식 (GET 링크 아님).

## 관찰 사실 — viewLogin.do 구조

- 제목: `VAATZ Marketplace`, DOM 69,660 bytes. main.do 공통 헤더(통합검색, 카테고리 버튼들) + 로그인 폼.
- 폼 5개: `form_logout`, `form_for_move`, `__search_form`, `formLeft`(action=`onLoad.do`), **`loginForm`**(POST).
- `loginForm` 필드:
  - `strUserId` text, maxlength 10, tabindex 1
  - `strPassWd` password, maxlength 20, autocomplete=off, tabindex 2
  - `strOTP` text maxlength 6, **style=display:none** (숨김), hidden `strStep` value="0"
  - hidden: `REQ_PARAM_CALLBACK_FUNCTION`, `REQ_PARAM_RETURN_URL=/main.do`, `REQ_PARAM_PROGRAM_URL=/main.do`, `csrf`(빈 값)
- 버튼이 **이미지**: `btn_login`, `btn_pwOver`(비밀번호 찾기), `btn_OTP`(display:none) — jQuery `bind("click")`로 `doLogin()/doPwOver()/doCreateOTP_POP()` 연결.
- `doLogin()` 흐름: validation → 아이디/비밀번호 공백 alert → `strStep=="2"`이면 OTP 요구 alert → `$.ajax POST /vmp/common/login/login.do` (strUserId, strPassWd, strStep, strOTP; header `res-protocol: json`). Enter 키는 `vmp_setCallFunctionByEnterKey("loginForm",["strPassWd"], doLogin)`.
- OTP 분기: `hasOtpKey = "N"` 서버 주입 변수; `btn_OTP` 클릭 시 confirm 후 `doCreateOTP_POP()`.
- 자동제출 방지: 모든 form에 dummy `display_none` text input 추가(`vmp_addDummyInputBoxForPreventAutoSubmit`).
- 접근성 트리: 입력 필드가 textbox로 노출되나 **label 이름 없음** (`textbox` 이름 빈 값; 이미지 `logingTable_item_1/2` 에 alt 없음), 로그인 영역 전체 table 중첩.

## 접근성·관찰성 신호 (해석)

- 사용자 입·출력 경로는 ajax + alert(팝업 문자열) 기반 → 에이전트가 상태(에러·단계)를 구조화해 읽기 어려움.
- OTP 단계가 `strStep` hidden 값과 display:none 토글로 제어 — 화면 상태가 DOM 가시성 플래그에 숨겨진 상태 기계.

## 한계

- 입력·인증 제출 미수행 → `login.do` 응답, csrf 주입 방식, OTP 표시 조건은 미확인.
