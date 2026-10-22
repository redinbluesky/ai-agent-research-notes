# 근거 — VAATZ 두 화면 캡처 보관 안내

보관 원칙: 마스킹된 최소 Evidence·요약만 저장한다. 쿠키 값, 세션 토큰, 자격 증명성 파라미터, 원본 대용량 DOM 전체는 저장하지 않는다.

## 파일 목록

| 파일 | 유형 | 내용 |
|---|---|---|
| `O-001-main-do-요약.md` | 실행 관찰 (SPA 아님) | main.do 정적 구조 요약 |
| `O-002-viewLogin-요약.md` | 실행 관찰 | viewLogin.do 화면 구조 요약 |
| `O-004-aside-form_login_info-요약.md` + `O-004-근거-*.png` 2장 | Aside 격리 관찰 | `#form_login_info` 비활성 확인·`jsCallLoginPage` 경로 (D-005/D-006) |
| `O-005-aside-파일럿-검증-요약.md` + `O-005-aside-파일럿-*.png` 3장 | Aside 교차 검증 (P5 AC-A1) | 파일럿에서 이름/레이블만으로 경로 발견~결과 판독 전 과정, E2E 7건과 독립 대조 |
| `O-006-rea-원본-main.png` + `O-006-rea-원본-main-접근성트리.txt` | 실행 관찰 (화면 비교용) | main.do 동일 조건(1280×720·ko-KR·Asia/Seoul·light) 스크린샷·AX 트리 |
| `O-006-rea-원본-viewLogin.png` + `O-006-rea-원본-viewLogin-접근성트리.txt` | 실행 관찰 (화면 비교용) | main.do → `img#btnLogin` 클릭 → viewLogin.do 스크린샷·AX 트리 |
| `파일럿-main/login/login-inline-error.png` + 각 `-접근성트리.txt` + `파일럿-캡처-로그.json` | 파일럿 캡처 (화면 비교용) | 원본과 동일 조건의 Playwright chromium 캡처 (입력 없는 빈 제출만 포함, `scripts/파일럿-캡처.mjs`) |

## 비교 관찰 Evidence 호출 기록 (파일 위치: `../../검증/근거-원본-캡처/`)

| 관찰 | Evidence ID | 도구 호출 |
|---|---|---|
| 원본 main.do 스크린샷·AX | `ev_40e17624f8b386da8e85d08f053dc39273f62a420525569cfe406a6a8dbdfe85` | `capture_browser_scenario` (launch, headless, 청정 프로필) |
| 원본 main.do → viewLogin.do 전환 포함 | `ev_c89fc8920c5c06d802c71d44bac1a3f35b2a9ca5f588ae60287f0fb6f5aa6c6c` | `capture_browser_scenario` (launch, headless) |
| 파일럿 `/` → `button "로그인"` → `/login` | `ev_888aaba70b41d8cedf06ddf54607b56ae46a8a8ddda7c2c06a918151747f59a5` | `capture_browser_scenario` (launch, headless) |

결과 문서: [../../검증/02.원본-파일럿-화면-비교.md](../../검증/02.원본-파일럿-화면-비교.md).

## 원본 Evidence 호출 기록 (원본 파일은 미보관)

| 관찰 | Evidence ID | 도구 호출 |
|---|---|---|
| main.dom DOM·AX 관찰 | `ev_d85dc4e56116f2194ede718b0be9e017a74ed4208c316e86b97c64361641e311` | `capture_browser_scenario` (launch, headless, 청정 프로필) |
| 로그인 전환 포함 캡처 | `ev_171a129f657b5384a532e952c120414861905a4786d411f1e0a0f6a887b2a45e` | `capture_browser_scenario` (launch, headless) |

두 호출 모두 `completeness: complete`, 이벤트 유지 1/0 dropped.
