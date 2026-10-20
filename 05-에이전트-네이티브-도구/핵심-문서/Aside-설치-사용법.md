# Aside 설치·사용법 — Windows에서 Claude 연결과 MCP 브라우저 자동화 시작하기

## 목적과 범위

Aside는 웹사이트, 계정, 브라우징 컨텍스트를 이용해 브라우저 작업을 수행하는 AI 브라우저다.[4][5] 이 문서는 영상에서 시연된 Claude 기반 가격 비교·Google Sheets 기록 흐름을 실제 도입 가능한 설치·연결·승인 절차로 분해한다.[1] **Windows에서 Aside 브라우저를 설치하고 Claude 구독을 연결해 작업을 시작하는 경로**, 그리고 외부 에이전트에 브라우저 자동화 기능을 제공하는 **MCP 연결 경로**를 구분해 정리한다.

> [!WARNING]
> 웹 브라우저 자동화는 로그인 세션, 파일, 웹 폼, 외부 서비스에 영향을 줄 수 있다. 결제·주문·계약·환불·외부 발송·개인정보 입력은 에이전트가 완료하도록 두지 말고, 최종 실행 직전에 사람이 검토·승인한다. 회사 계정·고객 데이터에는 조직의 보안·보존 정책과 권한 체계를 먼저 적용한다.

## 먼저 선택할 경로

| 목적 | 권장 경로 | MCP 필요 여부 |
|---|---|---|
| Aside 창에서 Claude로 웹 조사·표 작성 작업 수행 | Aside 브라우저 설치 → Claude Subscription 연결 | 필요 없음 |
| Claude Code 등 외부 MCP 클라이언트가 Aside 브라우저를 도구로 제어 | Aside 브라우저 + Aside CLI 설치 → `aside mcp` 등록 | 필요 |
| 정해진 브라우저 조작을 코드에 가깝게 확인 | Aside 브라우저 + Aside CLI → `aside repl` | 필요 없음 |

Claude 구독을 Aside의 모델 제공자로 연결하는 것은 OAuth 기반 구독 연결이며, 외부 에이전트에 `aside mcp`를 등록하는 것은 별개의 구성이다.[2][3]

## 1. Aside 브라우저 설치

1. 공식 다운로드 페이지 `https://aside.com/download`에서 Windows용 설치 파일을 내려받는다.
2. 내려받은 `.exe`를 실행하고 설치 절차를 따른다.
3. 설치가 끝나면 Aside를 열고 계정을 만들거나 로그인한다.
4. 온보딩에서 브라우저 데이터 가져오기를 제안하더라도, 업무용·개인용 프로필을 구분하고 필요한 범위만 선택한다.

공식 다운로드 페이지는 Windows에서 내려받은 실행 파일을 열어 설치를 진행하도록 안내한다.[6] 시작 가이드는 Aside 계정과 브라우저 구성 요소가 필요하며, 계정 로그인·브라우저 데이터 가져오기·비밀번호 관리자 설정·첫 작업 시작의 순서를 제시한다.[4]

### 데이터 가져오기 결정

Aside의 온보딩은 브라우징 기록, 쿠키, 북마크 가져오기를 지원한다.[4] 따라서 다음 기준을 권장한다.

- 개인 브라우저와 업무 브라우저는 가능한 한 별도 프로필로 운영한다.
- 필요하지 않은 쿠키·기록·북마크는 가져오지 않는다.
- 공유 PC, 공용 계정, 규제 대상 데이터가 있는 프로필은 조직 정책 확인 전 가져오지 않는다.
- 비밀번호 관리자 설정은 자동화 편의보다 접근 범위와 복구 절차를 우선 검토한다.

## 2. Claude 구독을 Aside 모델로 연결

1. Aside에서 `Settings > Models > Providers`로 이동한다.
2. `Connect`를 선택한다.
3. `Subscription` 아래의 `Claude Subscription`을 선택한다.
4. 팝업 OAuth 로그인에서 자신의 Claude Pro 또는 Max 계정 연결을 완료한다.
5. Aside로 돌아와 연결 상태를 확인한다.
6. `Settings > Models > Task models`에서 기본 작업 모델을 선택한다.

Aside 공식 문서는 Claude Pro 또는 Max 구독을 `Claude Subscription`으로 연결할 수 있으며, 연결된 제공자는 `Settings > Models > Providers`에 나타난다고 설명한다.[2] API 키로 Anthropic을 연결하는 방식도 별도로 제공되므로, 조직의 비용 청구·키 보관 정책에 따라 **구독 연결**과 **API 키 연결**을 혼동하지 않는다.[2]

## 3. 최소 권한으로 첫 브라우저 작업 실행

첫 작업은 결제·발송·데이터 변경이 없는 읽기 전용 조사로 한정한다. 공식 시작 가이드는 작업에 웹사이트·계정·파일이 필요할 경우 권한 모드와 작업 폴더를 선택하도록 안내한다.[4]

예시 요청:

```text
현재 탭의 제품 목록에서 모델번호, 판매가, 배송비, 원문 링크를 표로 정리해 줘.
배송비 또는 모델번호를 확인할 수 없는 행은 추정하지 말고 '검토 필요'로 표시해 줘.
웹사이트에서 주문·결제·로그인 정보 변경·메시지 전송은 하지 마.
```

검수할 항목:

- 모델번호·규격이 같은 대상을 비교했는가
- 수집 시각과 원문 링크가 남았는가
- 배송비·할인·재고처럼 변하는 조건을 별도 열로 기록했는가
- 누락값을 추정하지 않고 `검토 필요`로 표시했는가
- 외부 상태를 바꾸는 행동 전에 승인을 요청했는가

## 4. 선택: Aside CLI 설치

CLI는 터미널에서 Aside 작업을 시작하거나 MCP·REPL을 사용할 때만 설치한다. 브라우저 안에서 직접 작업하는 용도에는 필수가 아니다.

Windows에서는 공식 개발자 문서가 제공하는 PowerShell 설치 절차를 사용한다. 이 절차는 설치 스크립트를 내려받은 뒤 Authenticode 서명, 발급자, 타임스탬프를 검사하고 실행한다.[3]

```powershell
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$installer = Join-Path $env:TEMP 'aside-install.ps1'
$publisher = 'CN=AT YOUR SIDE INC, O=AT YOUR SIDE INC, L=San Francisco, S=California, C=US'
Invoke-WebRequest -UseBasicParsing -Uri https://releases.aside.com/install.ps1 -OutFile $installer
$signature = Get-AuthenticodeSignature -LiteralPath $installer
if ($signature.Status -ne 'Valid' -or $null -eq $signature.SignerCertificate -or $signature.SignerCertificate.Subject -ne $publisher -or $null -eq $signature.TimeStamperCertificate) {
  throw "Aside CLI installer signature verification failed ($($signature.Status): $($signature.StatusMessage))."
}
& $installer
```

설치 뒤에는 **새 터미널**을 열고 다음을 확인한다. Windows 설치 프로그램은 `aside`를 사용자 `PATH`에 추가한다.[3]

```powershell
aside --help
aside --update
```

관리형 기기에서 서명 검증이 `UnknownError`로 실패하면 우회하지 말고, 공식 문서가 안내한 신뢰할 수 있는 루트 인증서 정책을 조직 관리자와 확인한다.[3]

## 5. 선택: 외부 에이전트에 MCP로 연결

외부 MCP 클라이언트가 Aside의 브라우저 자동화 기능을 호출해야 할 때만 이 경로를 사용한다. Aside 공식 문서는 `aside mcp`를 MCP 서버 실행 명령으로 제공한다.[3]

MCP 클라이언트가 `mcp.json` 형식을 지원하면 다음과 같이 등록한다.

```json
{
  "mcpServers": {
    "aside": {
      "command": "aside",
      "args": ["mcp"]
    }
  }
}
```

### Codex에 등록하는 실제 절차

Codex는 `mcp.json`이 아니라 사용자 설정 파일 `C:\Users\<사용자>\.codex\config.toml`을 사용한다. 먼저 설정 파일을 고유한 이름으로 백업하고 Codex CLI로 Aside만 추가한다. 이 절차는 기존 REA 등 다른 MCP 등록을 보존한다.

```powershell
$backup = "$HOME\.codex\config.toml.aside-$(Get-Date -Format yyyyMMdd-HHmm).backup"
Copy-Item "$HOME\.codex\config.toml" $backup
codex mcp add aside -- aside mcp
codex mcp get aside
```

정상 등록되면 Codex 설정에는 다음과 동등한 항목이 있다.

```toml
[mcp_servers.aside]
command = "aside"
args = ["mcp"]
```

`codex mcp get aside`로 등록을 확인한 뒤 Codex를 완전히 재시작한다. 기존 REA 등록과 Aside 등록이 모두 남아 있는지 확인하고, 첫 요청은 읽기 전용 화면 탐색으로 제한한다.

### Hermes Agent에 등록하는 실제 절차

Hermes는 Codex의 `C:\Users\<사용자>\.codex\config.toml`을 공유하지 않는다. 활성 Hermes 프로필의 MCP 설정에 Aside를 별도로 등록해야 한다. Windows에서 Hermes가 실행하는 환경에서는 사용자 `PATH`의 `aside` 명령을 찾지 못할 수 있으므로, 설치된 `aside.exe`의 **전체 경로**를 사용한다.

```powershell
hermes mcp list
hermes mcp add aside --command "C:\Users\<사용자>\AppData\Local\Aside\CLI\current\aside.exe" --args mcp
hermes mcp test aside
```

등록 전에 `hermes mcp list`로 기존 Hermes MCP를 확인한다. `hermes mcp add`는 활성 프로필의 설정에 `aside` 항목만 추가한다. 등록 후에는 Hermes Desktop을 완전히 재시작해야 새 MCP 도구가 발견된다. 이 Desktop 런타임에서는 Aside 도구가 `mcp__aside__repl`처럼 `mcp__aside__...` 형식으로 노출되는 것을 실제 확인했다. 다른 Hermes 표면·버전에서는 접두사 표기가 달라질 수 있으므로, 새 세션의 도구 목록 또는 첫 읽기 전용 호출 결과로 확인한다.

다음 명령으로 등록 상태를 재확인한다.

```powershell
hermes mcp list
hermes mcp test aside
```

`hermes mcp test aside`가 실패하면 실행 파일 전체 경로, Aside Desktop의 로그인·local host 상태, Hermes 로그를 확인한다. Codex의 REA·Aside MCP 구성과 Hermes의 MCP 구성은 독립적이므로, 한쪽의 등록·제거가 다른 쪽을 변경하지 않는다.

### Aside 작업 대화의 모델 공급자 확인

**Codex → Aside MCP 연결**과 **Aside 작업 대화가 Codex 계열 모델을 사용하는지**는 별도 항목이다. 전자는 Codex가 `aside mcp`를 호출하는 도구 연결이고, 후자는 Aside의 작업 모델 제공자 설정이다. Aside는 `Settings > Models > Providers`에서 연결된 제공자를 표시하고, `Settings > Models > Task models`에서 작업 기본 모델을 선택한다.[2]

Aside CLI의 `aside exec --model provider/model`은 특정 실행의 모델을 지정할 수 있지만, 현재 저장된 Providers·Task models 목록을 출력하는 명령은 제공하지 않는다. 따라서 다음 UI에서 확인한다.

1. Aside에서 `Settings > Models > Providers`를 연다.
2. `OpenAI` 또는 Codex 관련 제공자·구독 항목의 연결 상태를 확인한다.
3. `Settings > Models > Task models`에서 현재 선택된 기본 작업 모델의 정확한 이름을 확인한다.
4. 연결된 제공자와 선택 모델의 이름만 기록하고, API 키·OAuth 정보·계정 식별 정보는 기록하지 않는다.

`ChatGPT Subscription`은 공식적으로 지원되는 구독 제공자이며, API 방식의 `OpenAI`도 별도 제공자다.[2] 화면에 나타나는 Codex 명칭이 이 둘 중 어느 경로에 속하는지는 해당 Providers 화면에서 판정한다.

### 로컬 OpenAI 호환 서버를 Custom Provider로 연결

Aside의 `Add custom provider` 창은 Pi 호환 Provider JSON을 받는다. 로컬 서버가 OpenAI Chat Completions 호환 `baseUrl`, 모델 목록, 채팅 완료 응답을 제공하면 `api: "openai-completions"` 방식으로 등록할 수 있다. 키 없는 로컬 서버라도 Pi 호환 구성에서는 모델을 노출하기 위한 더미 `apiKey` 값을 두고 `authHeader: false`로 설정할 수 있다.[9]

다음은 **형식 예시**다. 실제 `baseUrl`·모델 ID·문맥 창은 로컬 서버의 `/v1/models` 응답으로 확인한 값만 사용한다.

```json
{
  "providers": {
    "local-provider": {
      "name": "Local Provider",
      "api": "openai-completions",
      "baseUrl": "http://127.0.0.1:PORT/v1",
      "apiKey": "local-no-auth",
      "authHeader": false,
      "compat": {
        "supportsDeveloperRole": false,
        "supportsReasoningEffort": false,
        "maxTokensField": "max_tokens"
      },
      "models": [
        {
          "id": "server-advertised-model-id",
          "name": "Local Model",
          "reasoning": false,
          "contextWindow": 65536,
          "maxTokens": 4096,
          "input": ["text"]
        }
      ]
    }
  }
}
```

등록 전에는 `/v1/models`와 `/v1/chat/completions`를 각각 확인한다. 모델 ID가 기존 Hermes 설정에 표시된 값과 다르면, Aside에는 현재 서버가 실제로 반환한 모델 ID를 쓴다. Hermes는 서버에 없는 모델명을 보내도 llama.cpp 계열 서버가 로드된 모델을 반환해 우회 작동하지만, Aside은 팝업에 입력한 모델 ID를 요청에 그대로 보내므로 우회되지 않는다.[10] Function calling(`tool_calls` 반환)과 reasoning(`reasoning_content` 출력)을 사전 테스트로 확인하고, 확인된 값만 `reasoning` 플래그와 `contextWindow`에 반영한다. 처음에는 Task models의 기본값을 바꾸지 않고, 단순 읽기 전용 작업으로 연결·출력·도구 호출 호환성을 검증한다.

저장 여부와 실호출은 다음 두 위치로 검증한다:
- 저장: `C:\Users\<사용자>\.aside\u\0\models.json`의 `providers`에 프로바이더 항목이 있는지 확인한다.
- 실호출: `C:\Users\<사용자>\.aside\u\0\sessions\<세션>\messages.jsonl`의 message `model` 필드가 로컬 모델 ID인지, 응답이 로컬 모델에서 생성됐는지 확인한다. 같은 날 다른 세션의 기본 모델(`gpt-6.1-sol`) 응답과 대비하면 Task models 선택 적용이 구분된다.

Aside이 활성 탭의 페이지 컨텍스트를 추출하지 못해 표시하는 `no content extracted` 경고는 연동 오류가 아니라 SPA 페이지의 본문 추출 실패 안내다. 프롬프트 처리와 모델 호출에 영향이 없음을 세션 로그로 확인 후 기록한다. Custom provider 팝업 등록은 Aside Help Center에 문서화된 제공자 유형(plan/subscription/API-key)에 없고 Pi 호환 스키마 기반의 실험 경로로 취급한다.[2][10]

### 실행 중인 Codex 연결 확인

Codex 재시작 뒤에는 Aside MCP 도구 호출로 실제 세션 연결을 확인한다. 다음 요청은 페이지 탐색·입력·로그인·파일 접근을 금지하므로, MCP 서버가 응답하는지만 확인한다.

```text
Aside MCP 도구를 호출하여 현재 local host의 REPL 세션 상태만 확인해 줘.
페이지 이동·탭 변경·로그인·입력·파일 접근·다운로드·외부 전송은 하지 마.
REA 도구는 사용하지 말고, Aside MCP 도구 호출 결과와 미확인 사항만 요약해 줘.
```

`idle` 임시 시크릿 세션과 열린 탭 0개는 연결 실패가 아니라, 아직 탐색 대상이 열리지 않았다는 상태다. MCP 도구가 브라우저 프로필 또는 사이트 로그인 상태를 직접 열거하지 않을 수 있으므로, 실제 대상의 권한은 Aside에서 명시적으로 준비하고 첫 분석 요청의 범위를 제한한다.

### `exec`와 `repl`의 세션 경계

Aside MCP는 브라우저 에이전트 작업용 `exec`와 열린 페이지를 대상으로 하는 Playwright 스타일 명령용 `repl`을 구분한다. 여러 단계의 사용자 흐름(열기 → 요소 확인 → 클릭 → 전환 관찰)은 **한 번의 `exec` 호출**로 요청한다. 독립적인 `repl` 호출 사이에는 임시 세션·탭이 유지된다고 가정하지 않는다.

`exec` 호출을 한 번만 허용하는 작업에서, 프롬프트가 `repl` 사용까지 절대 금지하면 `exec`가 내부 브라우저 조작에 필요한 REPL 경로를 사용할 수 없어 실행을 거부할 수 있다. 따라서 호출 횟수 제한은 **외부 MCP 도구 호출**에 적용하고, `exec` 내부의 브라우저 제어 구현은 허용한다고 명시한다. 단, 실제로 추가 MCP 호출을 하거나 로그인·입력·제출·다운로드·외부 전송을 해서는 안 된다는 행동 제한은 그대로 유지한다.

Windows에서 `aside repl`이 페이지를 열었다고 성공을 반환해도, 해당 페이지는 임시 세션에서 처리되어 사용자가 보는 Aside Desktop 탭 목록에 나타나지 않을 수 있다. 따라서 화면에 새 탭이 보이지 않는 것만으로 CLI 또는 MCP 실패라고 판단하지 말고, 명령 결과의 URL·제목·관찰 결과와 세션 상태를 함께 확인한다.

### 팝업 기반 로그인 흐름의 차단 처리

기존 웹앱의 로그인 버튼이 팝업을 열도록 구현된 경우, Aside가 `팝업 차단됨` 안내를 표시하고 현재 URL·화면을 그대로 유지할 수 있다. 이때 자동화가 버튼 선택에 성공했더라도 로그인 화면 전환은 확인되지 않는다. 읽기 전용 초기 분석에서는 `허용`을 누르거나 사이트 권한을 바꾸지 말고, 차단 사실·현재 URL·미확인 항목을 기록한다. 팝업 허용은 브라우저 사이트 권한을 변경하므로, 별도의 명시적 승인 뒤에만 적용하고 같은 단일 `exec` 시나리오를 재실행한다.

### 권장 운영 모델: Aside 중심, REA 근거 분리

**제안:** 웹 화면·사용자 흐름 분석의 첫 진입점은 Aside로 둔다. Aside의 Agent Tab과 작업 대화는 실제 브라우저 화면, 작업 경과, 권한 요청을 한 화면에서 검토하기에 적합하다. Aside는 읽기 전용을 포함한 작업 권한 모드와 현재 탭을 작업 문맥으로 붙이는 기능을 제공한다.[7]

| 역할 | 주 도구 | 산출물·경계 |
|---|---|---|
| 화면 탐색·사용자 흐름 재현 | Aside Agent Tab 또는 Aside 작업 대화 | 화면·URL·팝업·입력 요소·사용자 흐름 관찰. 읽기 전용으로 시작하고, 상태 변경은 사람 승인 뒤에만 수행한다. |
| 분석 계획·결과 종합 | Codex 또는 Hermes | 관찰 목표·금지 행동을 구조화하고, Aside 작업 결과를 한국어 분석 문서로 정리한다. Codex/Hermes의 MCP 연결은 Aside를 호출하는 보조 경로다. |
| 기술적 Evidence 수집·검증 | REA + 별도 Chrome/Chromium 테스트 프로필 | DOM·접근성·스크립트·네트워크·스크린샷 Evidence를 수집하고 비교한다. REA의 CDP 관찰은 일반 브라우저 자동화가 아니라 수동적 Evidence 수집 성격이다.[8] |

이 구성을 따르면 브라우저 조작의 실제 화면과 권한 판단은 Aside에서 투명하게 확인하고, Codex·Hermes는 분석 설계와 기록을 담당하며, REA는 재현 가능한 기술 근거를 보강한다. 단, Aside의 우측 작업 대화가 어떤 모델 제공자를 사용 중인지는 화면만으로 Codex 직접 연결이라고 단정하지 않는다. `Settings > Models > Providers`와 MCP 등록 상태를 각각 확인한다.

실제 등록 전에 다음을 확인한다.

1. Aside 브라우저에 로그인되어 있고 필요한 대상 사이트의 권한·세션을 의도적으로 준비했는가
2. MCP 클라이언트의 설정 파일 위치와 변경 범위를 확인했는가
3. `command`에 사용하는 `aside` 실행 경로가 현재 사용자 계정의 신뢰 가능한 설치 경로인가
4. MCP 클라이언트를 완전히 재시작한 뒤 도구 목록과 최소 읽기 전용 작업으로 연결을 확인했는가
5. 프로젝트마다 계정·작업 폴더·허용 행동을 분리했는가

공식 문서는 개발자 설정에서도 지원 도구를 위한 브라우저 자동화 구성을 설치할 수 있다고 안내한다.[3] 다만 개별 MCP 클라이언트의 설정 파일·권한 모델은 서로 다르므로, 해당 제품의 공식 문서와 조직 규칙을 함께 적용해야 한다.

## 6. 선택: REPL로 결정적 브라우저 조작 확인

반복 가능하고 세밀한 페이지 점검, 스크린샷, 다운로드, 결정적 조작이 필요하면 `aside repl`을 사용한다.[3]

```bash
aside repl "const p = await openTab('https://example.com')"
```

REPL은 구현·테스트·진단을 위한 경로다. 프로덕션 웹사이트에서 상태를 바꾸는 명령을 시험할 때는 테스트 계정·테스트 데이터·사전 승인된 범위로 제한한다.

## 7. 운영 체크리스트

- [ ] 브라우저 설치 파일과 CLI 설치 스크립트를 공식 도메인에서 받았다.
- [ ] 개인·업무 브라우저 프로필과 가져올 데이터 범위를 구분했다.
- [ ] Claude 구독 연결과 API 키 연결 중 조직 정책에 맞는 방식을 선택했다.
- [ ] 처음에는 읽기 전용·가역적인 작업으로 결과 정확도를 검증했다.
- [ ] 비교 기준, 누락값 처리, 출력 열, 원문 링크 보존 규칙을 프롬프트에 명시했다.
- [ ] 결제·제출·발송·개인정보 입력을 사람 승인 없이 실행하지 않도록 제한했다.
- [ ] MCP를 쓰는 경우 클라이언트별 설정 위치·도구 권한·로그 보관 정책을 검토했다.
- [ ] 계정, 토큰, 인증 파일, 세션 데이터를 문서·저장소·공용 폴더에 기록하지 않았다.

## Sources

[1] https://www.youtube.com/watch?v=HBLrAAlqdcE
[2] https://docs.aside.com/help/ai
[3] https://docs.aside.com/help/developers
[4] https://aside.com
[5] https://docs.aside.com/help/get-started
[6] https://aside.com/download
[7] https://docs.aside.com/help/tasks
[8] https://raw.githubusercontent.com/morluto/rea/main/docs/browser-observation.md
[9] https://github.com/earendil-works/pi/blob/c779c14e91bc2ea65143e59b0dc1baf3646ba8c9/packages/coding-agent/docs/custom-provider.md
[10] 실제 검증 (2026-10-19): `http://127.0.0.1:8080/v1/models`·`/v1/chat/completions` 실측, `C:\Users\ParkJuYeong\.aside\u\0\models.json`, 세션 `<검증-세션>` message 로그 — 사례 문서 [Hermes와 Aside 공유 로컬 모델 연동](../../03-에이전트-설정/사례/2026-10-19-Hermes-Aside-공유-로컬모델-연동.md)
