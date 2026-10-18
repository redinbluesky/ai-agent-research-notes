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
