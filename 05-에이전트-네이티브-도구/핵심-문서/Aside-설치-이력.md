# Aside 설치 이력

## 설치 목적

- Aside 데스크톱 브라우저의 자동 화면 탐색 기능을 Codex에서 MCP로 호출한다.
- Hermes Agent(`ai` 프로필)에서도 Aside MCP를 별도로 호출한다.
- Codex의 REA MCP와 Aside MCP를 병렬로 사용한다. Aside는 화면·사용자 흐름 탐색, REA는 별도 Chrome/Chromium 테스트 프로필의 수동적 Evidence 수집을 담당한다.
- 분석 권한이 있는 웹 애플리케이션과 테스트 계정만 사용하며, 결제·제출·발송·계정 변경 같은 상태 변경은 수행하지 않는다.

## 환경

| 항목 | 값 |
|---|---|
| 운영체제 | Windows 11 (10.0.26200.9711) |
| 외부 에이전트 | Codex, Hermes Agent (`ai` 프로필) |
| REA 연동 상태 | 설치·실연결 검증 완료 (REA 6.7.0) |
| Aside 데스크톱 | 설치·실행 확인 — 사용자 제공 화면 캡처 기준 |
| Aside CLI | 설치·실행 확인 — 1.26.1019.1018 |
| Aside CLI 경로 | `C:\Users\ParkJuYeong\AppData\Local\Aside\CLI\current\aside.exe` |
| 설치 방식 | Aside Developers 화면이 제공한 서명 검증 설치 명령 |

## 진행 이력

| 일시 (KST) | 단계 | 수행 내용 | 결과 | 비고 |
|---|---|---|---|---|
| 2026-10-19 16:37 | 초기화·데스크톱 확인 | Aside 새 탭 화면의 사용자 제공 캡처를 확인하고 설치 이력 문서를 생성했다. | 진행 중 | Aside가 실행 중이며, 화면 하단에 `Connect Aside to Codex` 안내와 `Connect` 버튼이 표시됐다. 아직 Codex 설정·Aside CLI·계정 권한은 변경하지 않았다. |
| 2026-10-19 16:38 | 1. 개발자 설정 확인 | `Settings > Developers` 화면을 확인했다. | 변경 전 검토 완료 | Aside CLI는 미설치 상태로 `Install` 메뉴가 표시되고, `Enable Aside MCP server` 토글은 꺼져 있다. Aside Skills 추가 메뉴와 별도의 원격 세션(Pro) 토글도 확인했다. |
| 2026-10-19 16:39 | 2. MCP 설정 안내 확인 | `How to set up MCP server?` 안내를 열었다. | 변경 전 검토 완료 | 안내는 Aside CLI 설치를 선행 조건으로 명시하고, MCP 클라이언트 설정에 `aside mcp` 명령을 등록하도록 제시했다. 아직 설치·등록·토글 변경은 수행하지 않았다. |
| 2026-10-19 16:41 | 3. CLI 설치 명령 검토 | Developers 화면의 `Install > Copy command`로 공식 설치 명령을 확인했다. | 승인 대기 | 임시 폴더에 설치 스크립트를 내려받아 Authenticode 상태·발급자·타임스탬프를 확인한 뒤 실행한다. |
| 2026-10-19 16:43 | 4. Aside CLI 설치 | 서명 검증 설치 명령을 실행했다. | 설치·실행 통과 | Aside CLI 1.26.1019.1018이 `C:\Users\ParkJuYeong\AppData\Local\Aside\CLI\current\aside.exe`에 설치됐다. 해당 실행 파일의 `--help`가 정상 응답했다. |
| 2026-10-19 16:44 | 5. PATH 준비 상태 확인 | 새 명령 프롬프트에서 `aside --version`, `aside --help`를 실행했다. | 통과 | 사용자 `PATH`에서 Aside CLI 1.26.1019.1018을 인식한다. MCP 서버 명령 `aside mcp`와 계정 상태 확인 명령 `aside account`가 제공된다. |
| 2026-10-19 16:46 | 6. 연결 상태 사전 확인 | `aside account`, `aside host`, `codex mcp list`를 실행했다. | 추가 확인 필요 | Aside의 앞 두 명령은 하위 명령 도움말만 출력했다. `codex mcp list`에는 기존 `rea` 등록이 확인됐으나 출력이 절단돼 `aside` 부재 여부는 개별 조회로 재확인한다. |
| 2026-10-19 16:47 | 7. 연결 상태 상세 확인 | `aside account status`, `aside host status`, `codex mcp get aside`를 실행했다. | 등록 전 상태 확인 | Aside CLI는 로컬 호스트의 로그인된 계정과 `Profile 0`을 인식한다. Codex에는 `aside` MCP가 아직 없으며, 기존 `rea` 등록을 보존한 채 Aside만 추가할 수 있다. 계정 식별자는 기록하지 않는다. |
| 2026-10-19 16:50 | 8. Codex Aside MCP 등록 | Codex 설정을 백업하고 `codex mcp add aside -- aside mcp`를 실행했다. | 등록 완료 | 백업 파일과 `[mcp_servers.aside]` 항목, `aside mcp` 실행 명령의 존재를 확인했다. REA 등록은 수정하지 않았다. |
| 2026-10-19 16:55 | 9. Codex Aside MCP 실연결 검증 | 재시작한 Codex에서 Aside MCP의 읽기 전용 세션 조회를 실행했다. | 통과 | local host의 REPL 세션은 `idle` 임시 시크릿 세션이며 열린 Aside Browser 탭은 0개다. MCP 도구 호출은 정상 응답했으나 프로필·로그인 상태 직접 열거는 제공되지 않았다. |
| 2026-10-19 16:57 | 10. 첫 분석 범위 승인 | 대상 URL과 화면 범위를 지정하고 읽기 전용 분석 권한을 확인했다. | 승인됨 | 대상은 `https://www.vaatz.com/vmp/main.do`이며, 우측 상단 로그인 버튼 선택 후 로그인 화면으로 이동하는 사용자 흐름만 관찰한다. 로그인·입력·제출·다운로드·외부 전송은 금지한다. |
| 2026-10-19 17:00 | 11. 첫 자동 화면 분석 시도 | Codex에서 Aside MCP로 대상 페이지를 열고 로그인 버튼 선택을 요청했다. | 부분 실패 | 초기 화면 요소는 관찰했으나 버튼 선택 호출이 `Aside isn't running on this machine`으로 실패했다. 로그인 화면 전환은 확인하지 못했다. 직접 CLI 진단에서는 local host의 `Profile 0`이 `connected`이고, 유휴 임시 REPL 세션 2개가 확인됐다. |
| 2026-10-19 17:12 | 12. CLI 단독 REPL 경로 검사 | 같은 Windows 사용자 CMD에서 `aside repl`로 대상 URL을 열고 제목을 조회했다. | 통과 | `VAATZ Marketplace` 제목과 URL을 정상 반환했다. 페이지는 임시 세션에서 처리되어 사용자가 보는 Aside Desktop 탭에는 나타나지 않았다. 따라서 Desktop UI의 탭 부재는 CLI 실패 증거가 아니다. |
| 2026-10-19 17:18 | 13. Codex 단일 exec 흐름 재시도 | Codex에서 Aside MCP `exec` 한 번으로 대상 열기·로그인 버튼 선택·전환 관찰을 요청했다. | 부분 통과 | Aside Desktop Agent Tab에서 대상이 열렸다. 버튼 선택은 수행됐으나 `팝업 차단됨` 안내가 표시돼 URL과 초기 화면이 유지됐다. 로그인 화면 전환은 확인하지 못했으며, 팝업 허용은 별도 승인 전까지 수행하지 않는다. |
| 2026-10-19 17:23 | 14. 팝업 권한 변경 승인 | VAATZ 사이트에 한해 팝업을 허용하고 같은 단일 exec 시나리오를 재실행하기로 승인했다. | 승인됨 | 사이트별 브라우저 권한 변경 후 로그인·입력·제출·다운로드·외부 전송 금지는 계속 유지한다. |
| 2026-10-19 17:30 | 15. Hermes Aside MCP 등록·연결 시험 | Hermes `ai` 프로필에 Aside CLI 전체 경로와 `mcp` 인수를 등록하고, 도구 검색 및 stdio 연결 시험을 실행했다. | 통과 | `C:\Users\ParkJuYeong\AppData\Local\Aside\CLI\current\aside.exe mcp`로 등록했다. Hermes가 `repl`, `memory_search`, `exec` 3개 도구를 발견·활성화했고 `hermes mcp test aside` 연결이 875ms에 성공했다. 새 Hermes 세션에서 도구가 노출된다. Codex 설정은 변경하지 않았다. |
| 2026-10-19 17:46 | 16. Hermes Desktop 새 세션 도구 호출 검증 | 새 Hermes Desktop 대화에서 Aside MCP의 읽기 전용 REPL 상태 조회를 실행했다. | 통과 | 실제 노출 도구명은 `mcp__aside__repl`이었다. `replPageAttached: false`, `attachedTabCount: 0`, `openBrowserTabCount: 1`이 반환됐다. 페이지 이동·탭 연결 또는 변경·로그인·입력·파일 접근·다운로드·외부 전송은 수행하지 않았다. 열린 탭의 URL·제목·활성 여부·내용은 미확인이다. |
| 2026-10-19 17:49 | 17. Codex 단일 exec 재시도 실패 | Codex에서 Aside MCP `exec`만 한 번 허용하는 프롬프트로 VAATZ 열기·로그인 버튼 선택을 요청했다. | 실패 | `exec`가 브라우저 조작에 `repl`이 필요하다고 반환했으나 프롬프트가 `repl`을 금지해 실행하지 못했다. 사이트 열기·로그인 버튼 선택은 수행되지 않았고, 전환 전후 URL·팝업 또는 새 탭·로그인 화면 요소는 모두 미확인이다. |
| 2026-10-19 17:54 | 18. Codex 단일 exec 재검증 | Aside MCP 외부 도구 호출을 `exec` 1회로 제한하되 내부 REPL 구현은 허용해 VAATZ 로그인 버튼을 한 번 선택하고 8초 동안 관찰했다. | 부분 통과 | 대상은 이미 Agent Tab에 열려 있었다. 전환 전후 URL은 모두 `https://www.vaatz.com/vmp/main.do`였고, 새 탭·팝업·로그인 입력 항목·오류 문구는 나타나지 않았다. 초기 화면과 기존 로그인 버튼·OTP 안내 공지는 유지됐다. 로그인 화면 전환은 미확인이다. |
| 2026-10-19 18:00 | 19. Aside의 Codex·Hermes 연결 상태 재확인 | Aside CLI 모델 관련 옵션과 Hermes MCP 상태를 조회했다. | 부분 통과 | Codex → Aside MCP는 앞선 `exec` 실제 호출로 연결이 확인돼 있다. Hermes `ai` 프로필도 Aside MCP `repl`·`memory_search`·`exec` 3개 도구를 발견하고 stdio 연결 시험을 922ms에 통과했다. 다만 Aside 작업 대화가 실제로 Codex 또는 OpenAI 제공자를 사용하는지는 CLI로 열거할 수 없어 `Settings > Models > Providers`와 `Task models` UI 확인이 필요하다. |
| 2026-10-19 18:07 | 20. Aside 작업 모델 UI 확인 | 사용자 제공 `Settings > Models` 화면에서 Providers와 Task models를 확인했다. | 확인 완료 | Providers에는 `Aside (Free)`와 `ChatGPT (Subscription)`만 표시된다. Default·Standard·Deep·Visual은 `GPT-6.1 Sol`, Fast는 `GPT-6 Luna`, 이미지 생성은 `ChatGPT Image …`로 보인다. Connect 메뉴의 Subscription 목록에는 Claude·GitHub Copilot·Grok·Kimi Code·Meta Muse·MiMo Token Plan이 보이며, 명시적인 Codex 제공자는 표시되지 않는다. 따라서 Aside 작업 대화는 ChatGPT Subscription 기반 GPT-6 계열 모델을 사용 중인 것으로 보이며, Codex Desktop MCP 연결과는 별개다. |
| 2026-10-19 18:11 | 21. 로컬 Custom Provider 사전 호환성 검사 | Aside의 `Add custom provider` JSON 형식을 확인하고, Hermes가 쓰는 로컬 OpenAI 호환 endpoint의 모델 목록·채팅 완료 응답을 읽기 전용으로 시험했다. | 사전 조건 통과 | Aside는 Pi 호환 Provider JSON에 `api: "openai-completions"`·`baseUrl`·`models`를 받는다. 로컬 endpoint는 `/v1/models`에서 `qwen3.8-flash-next-iq2_xs`, text 입력, `n_ctx: 65536`을 반환했고 `/v1/chat/completions`는 같은 모델로 `OK` 응답을 반환했다. Hermes 설정 화면의 표시 모델 ID와 현재 endpoint 반환 ID가 다르므로, Aside 등록에는 endpoint가 실제 반환한 ID를 사용한다. Function calling 테스트(`tool_calls` 반환)와 reasoning(`reasoning_content` 출력)도 통과했다. 아직 Aside에 저장하거나 기본 Task model을 변경하지 않았다. |
| 2026-10-19 19:10 | 22. Custom Provider 저장 | 사용자가 Aside `MODELS > +Connect > +Add custom provider` 팝업에 `local-strata` JSON을 입력하고 Save했다. | 저장 완료 | `C:\Users\ParkJuYeong\.aside\u\0\models.json`에 `local-strata` 프로바이더(`api: openai-completions`, `baseUrl: http://127.0.0.1:8080/v1`, `authHeader: false`, 모델 ID `qwen3.8-flash-next-iq2_xs`, `reasoning: true`, `contextWindow: 65536`, `maxTokens: 8192`, input text)가 반영됐다. 저장된 `apiKey` 값은 기록하지 않는다. |
| 2026-10-19 19:11 | 23. 실호출 검증 | 사용자가 Aside에서 `7×8 계산해줘`를 입력하고 응답을 확인했다. 에이전트가 세션 로그와 설정 파일로 검증했다. | 통과 | 세션 `<검증-세션>`의 message 로그: user `7×8 계산해줘`, assistant `7 × 8 = **56**`(정답), model 필드 `qwen3.8-flash-next-iq2_xs`. 같은 날 다른 세션은 Aside 기본 모델 `gpt-6.1-sol`로 응답한 것과 대비되어 Task models 선택 적용이 확인됐다. |
| 2026-10-19 19:0x | 24. Context Warning 해석 | 사용자가 보고한 `@url:http://localhost:8080/#monitor: no content extracted` 경고의 원인을 판정했다. | 해석 완료 | 연동 오류가 아니라 SPA(#monitor) 활성 탭의 페이지 컨텍스트 추출 실패 안내다. 프롬프트 처리와 모델 호출에 영향이 없음을 세션 로그로 확인했다. |
| 2026-10-19 19:17 | 25. 사례 기록 | 과정 전체를 사례 문서로 저장하고 주제 README에 링크를 추가했다. | 완료 | `03-에이전트-설정/사례/2026-10-19-Hermes-Aside-공유-로컬모델-연동.md` 생성, `03-에이전트-설정/README.md` 사례 표 갱신. |

## 사전 확인 원칙

- `Connect`를 누르기 전 연결 마법사가 제시하는 설정 파일, 실행 명령, 계정·권한 변경 범위를 확인한다.
- Codex의 기존 REA MCP 등록은 보존하며, Aside 등록만 추가한다.
- 첫 브라우저 작업은 `Read only` 또는 동등한 최소 권한으로 수행한다.
- 개인 브라우저 프로필·운영 계정·고객 데이터는 초기 검증 범위에서 제외한다.

## 문서 보완 사항

실제 Codex 연동에서 확인한 차이를 `Aside-설치-사용법.md`에 반영했다.

- `mcp.json` 예시와 구분해 Codex의 `config.toml` 등록 절차를 추가했다.
- 고유 백업 생성, `codex mcp add aside -- aside mcp`, 등록 확인, Codex 재시작 순서를 명시했다.
- 기존 REA MCP 등록을 보존해야 함을 명시했다.
- 실행 중인 Codex에서 Aside MCP 세션을 읽기 전용으로 검증하는 요청과 `idle`·탭 0개 상태의 해석을 추가했다.
- 여러 단계의 브라우저 흐름에는 단일 `exec` 호출을 사용하고, `repl`의 임시·비표시 세션을 Desktop 탭과 동일시하지 않는 원칙을 추가했다.
- 팝업 기반 로그인 흐름에서 팝업 차단 안내가 나타났을 때의 기록·별도 승인 절차를 추가했다.
- Hermes `ai` 프로필의 별도 MCP 등록 방식, Windows에서 전체 `aside.exe` 경로를 사용하는 이유, 연결 시험·새 세션 필요 사항을 추가했다.
- Hermes Desktop에서 실제 노출되는 도구명 `mcp__aside__repl`과 읽기 전용 상태 조회 결과를 반영했다.
- Codex의 `exec`가 내부 브라우저 조작을 위해 REPL 경로를 요구할 수 있으므로, 단일 `exec` 요청에서 `repl` 구현 자체를 절대 금지하지 않는 제한 원칙을 추가했다.
- Agent Tab·작업 대화를 화면 탐색의 첫 진입점으로 두고, Codex/Hermes는 분석·기록, REA는 별도 브라우저의 Evidence 수집을 담당하는 운영 모델을 추가했다.
- Codex → Aside MCP 연결과 Aside 작업 대화의 모델 제공자 연결을 분리해 확인하는 절차를 추가했다.
- 로컬 OpenAI 호환 endpoint를 Aside Pi Custom Provider JSON으로 연결하기 위한 사전 호환성 검사와 최소 구성 형식을 추가했다.
- Hermes는 모델명 불일치도 서버 우회로 작동하지만 Aside은 입력한 모델 ID를 그대로 요청에 보내므로 우회되지 않는 차이를 추가했다.
- 저장 검증(`models.json` providers)과 실호출 검증(`sessions/<세션>/messages.jsonl`의 model 필드) 위치를 명시했다.
- `no content extracted` 컨텍스트 경고는 연동 오류가 아니라 SPA 페이지 본문 추출 실패 안내라는 해석을 추가했다.
- Function calling·reasoning 사전 테스트 결과를 플래그에 반영하는 원칙과 custom provider 팝업이 문서화되지 않은 실험 경로임을 명시했다.

## 다음 단계

1. ~~Aside `Add custom provider` 창에 검증된 로컬 endpoint·현재 서버 모델 ID를 반영한 JSON을 붙여넣고 저장한다.~~ 완료 (2026-10-19, 단계 22)
2. ~~새 로컬 제공자로 단순 읽기 전용 응답을 시험한다.~~ 완료 (2026-10-19, 단계 23 — 계산 응답 통과)
3. 텍스트 응답이 안정적일 때만 Aside 화면 탐색 작업에 적용하고, GPT-6.1 Sol은 복잡한 시각·다단계 작업의 기준 모델로 유지한다. — 현재 진행 단계
4. Aside 화면 탐색 작업(읽기 전용)에서 로컬 모델의 도구 호출 안정성을 반복 검증한다. `reasoning: true` 저장 상태에서 thinking 파라미터 전송 오류가 발생하면 `false`로 되돌린다.
