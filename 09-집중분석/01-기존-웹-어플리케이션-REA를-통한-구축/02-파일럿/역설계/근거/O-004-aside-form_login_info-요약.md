# O-004 · Aside 관찰 — main.do의 form_login_info·로그인 관련 요소 (2026-10-20)

- 관찰 시각: 2026-10-20 (KST)
- 도구: Aside CLI (`aside.exe exec`,Aside 브라우저 에이전트) — Aside 프로필 `Profile 0`(connected), 세션 `2026-10-20_ujmts5Xk1zEaXS18`
- 재현 절차: "관찰만" 지시 프롬프트 — 이동 금지·타이핑 금지·클릭 금지·다운로드 금지·로그인 시도 금지 명시. 에이전트는 DOM 조회와 정적 스크립트 파일 읽기만 사용
- 대상: `https://www.vaatz.com/vmp/main.do`

## 관찰 사실 (Aside 보고)

1. **`form#form_login_info` 존재 확인** — `method=post`, `enctype=urlencoded`, `action`·`onsubmit`·`target` 없음. 위치: 화면 상단 배너 영역(`TD.intro_top_bg`), 렌더 780×20.
2. **이 form의 입력은 hidden 2개뿐**: `REQ_PARAM_CALLBACK_FUNCTION`, `REQ_PARAM_RETURN_URL`(빈 값). text/password/submit 입력 0개 — 페이지 전체에 `type="text"`, `type="password"`, `password` 출현 0회. **자격 증명 입력이 없는 폼**.
3. **이 form을 참조·사용하는 스크립트 없음 (확인)** — `form_login_info` 문자열: HTML 2회(자신의 id/name), inline 스크립트 4개·common.js·vmp.js·xtm.extUtils.js 모두 0회. `getElementById`·`.submit()`·jQuery 참조 불검출. → **제출 경로가 없는 비활성 마크업**.
   - `REQ_PARAM_CALLBACK_FUNCTION`은 common.js에서 `vmp_popupWindow`/`vmp_simpleDo`가 **동적으로 생성한 별도 form**에만 사용 (`form_login_info`와 무관).
4. **`#btnLogin`** — `IMG` 태그(`btn_login.gif`, alt=로그인, 50×17), 인라인 onclick 없음. jQuery bind: `$("#btnLogin").bind("click", … jsCallLoginPage())`. 실제 함수명은 **`jsCallLoginPage`** — `jsLoginRedirect`가 아님.
   - `jsCallLoginPage()`: 동적 form 생성(`form_common_btnLogin`, method=post, `action=/vmp/common/login/viewLogin.do`) + hidden `strRtnVoReset=Y` 1개 append + `f.submit()`. **자격 증명 없는 hidden 1개 POST 이동**.
5. **`form_login_info`와 무관한 로그인 관련 요소 확인**:
   - `TD.icon_btn` 블록: `a href="/vmp/common/login/viewLogin.do"` + 이미지(alt/id 없음, Dreamweaver MM_swapImage 속성) — **직접 URL GET 링크**
   - 페이지 폼 인벤토리 총 4개: `form_login_info`(hidden 2), `form_for_move`(hidden 3, csrf 포함), `form_logout`(hidden 3), `form_common_popup`(action `popupMasterOpen.do`, target 74)
   - `doLogout()` 정의만 존재(연결 DOM 0건), `form_logout` 제출 버튼 없음
   - 로그인 전/후 분기: `doDirectMenu03` 외부 SSO POST(`lms3.e-kpc.or.kr/…vaatzSSOLogin.jsp`), `doDirectMenu03_1()` → `alert("먼저 로그인하십시오.")`
   - 로그인 경로 집합: `ma005/onLoad.do`, `ma006/open.do`, `ma007/buyCatItem.do`, `ma008/aboutmp.do`, `viewLogin.do`, `logout.do`
6. `iframe#hidden_iframe`(about:blank)를 target으로 참조하는 요소 0건.

## Aside 세션에서 생성한 캡처 (클릭 없음, 요소 정적 캡처)

- `O-004-근거-form_login_info.png` — form 영역
- `O-004-근거-icon_btn.png` — icon_btn 블록의 viewLogin.do 링크

## 페이지 자체 발생 이벤트 ( 에이전트 개입 없음)

- 로드 시 사이트 스크립트가 공지 팝업(`form_common_popup`, target 74)을 별도 창으로 오픈 — 관찰자 미개입. (O-003의 `closeWin is not defined` 오류와 같은 스크립트 결함 계열)

## 마스킹 정책 준수

쿠키·토큰·hidden 값 원문, csrf 값, 자격 증명성 파라미터 값을 보고하지 않았다. 함수명·속성·구조만 인용.
