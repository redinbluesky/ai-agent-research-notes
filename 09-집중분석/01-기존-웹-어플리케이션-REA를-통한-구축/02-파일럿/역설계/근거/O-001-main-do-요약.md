# O-001 근거 요약 — main.do (메인 화면)

- 관찰 시각: 2026-10-20 (KST) · 도구: `mcp__rea__capture_browser_scenario` (Chrome 140, headless launch, 청정 격리 프로필, 저장소 preseed 없음)
- 대상: `https://www.vaatz.com/vmp/main.do` — HTTP 200, DOM 33,138 bytes
- Evidence ID: `ev_d85dc4e56116f2194ede718b0be9e017a74ed4208c316e86b97c64361641e311`
- completeness: complete (missing/truncated 없음)

## 관찰 사실 (정적 구조)

- 페이지 제목: `VAATZ Marketplace`
- 레이아웃: 중첩 `<table>` 기반 (table → rowgroup → cell → 하위 table). SPA 프레임워크 흔적 없음 — 서버 렌더링 + jQuery.
- 스크립트: `/vmp/scripts/jquery/jquery-1.9.1.min.js`, `common.js`, `json2.js`, `vmp.js`, `xtm/xtm.extUtils.js` (외부 6건) + 인라인 스크립트 다수.
- 폼 4개: `form_logout`, `form_for_move`(POST), `form_login_info`(POST), `form_common_popup`(action=`/vmp/common/main/popupMasterOpen.do`, target 팝업). hidden 필드 패턴: `REQ_PARAM_CALLBACK_FUNCTION`, `REQ_PARAM_RETURN_URL`, `csrf`(값 빈 문자열로 렌더).
- 로그인 진입 요소: `<img src="…/btn_login.gif" id="btnLogin" name="btnLogin" alt="로그인" style="cursor:pointer;">` — 앵커·버튼이 아니라 **클릭 가능한 이미지**. onclick 인라인 없음(스크립트에서 bind).
- hidden iframe 1개: `hidden_iframe` (about:blank, 0×0).
- 접근성 트리는 table/cell 행렬로 중첩 깊이 큼; 이미지 버튼은 role=img (alt "로그인").

## 접근성·관찰성 신호 (해석)

- 내비·버튼이 이미지 + `javascript:jsXxxRedirect()` 스타일 링크로 구성 → 키보드/screen-reader 경로 약함.
- `csrf` hidden 필드가 값 없이 렌더 → 실제 값은 세션/스크립트 경로로 주입될 가능성 (미확인).

## 한계

- headless 1회 관찰, 상호작용 없음. 이벤트·쿠키·네트워크 트랜잭션 값은 저장하지 않음.
