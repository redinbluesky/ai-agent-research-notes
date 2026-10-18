# REA 설치·사용법 — Windows에서 에이전트 분석 도구 시작하기

## 목적과 범위

REA(Reverse Engineer Anything)는 AI 에이전트가 CLI 또는 MCP를 통해 로컬 대상의 구조·코드·런타임 관찰 결과를 조사하도록 연결하는 도구다. 이 문서는 **Windows에서 권한이 있는 대상**을 안전하게 분석하기 위한 최소 설치·확인·사용 흐름을 정리한다.[1]

> [!WARNING]
> REA 자체의 MIT 라이선스는 분석 대상 소프트웨어, 상용 분석 엔진, 계정, 데이터에 대한 사용 권한을 부여하지 않는다. DRM·라이선스 검사·안티치트·인증·접근 통제 우회, 독점 코드·자산 복제에는 사용하지 않는다.[4]

## 무엇을 할 수 있는가

| 대상 | 가능한 조사 예시 | 핵심 준비물 |
|---|---|---|
| JavaScript·Electron 앱 | 모듈, import, 소스맵, 라우트, IPC 관계 분석 | Node.js·npm |
| 웹사이트 | 페이지 구조, 스크립트, 네트워크 관찰, 스크린샷 | Chrome 계열 브라우저 |
| .NET 어셈블리 | 메타데이터, CIL, 선언된 네이티브 의존성 | 정적 분석은 별도 네이티브 엔진 불필요 |
| 네이티브 바이너리 | 의사 코드, 어셈블리, 문자열, 심볼, 호출·참조 관계 | Hopper·Ghidra·IDA 중 하나 |

REA의 역할은 분석 엔진의 결과를 에이전트가 호출·추적·설명할 수 있는 CLI/MCP 작업 흐름으로 묶는 것이다. 분석 뒤 실제 기능 구현과 테스트는 별도의 개발 작업으로 수행한다.[1]

## 1. 사전 조건 확인

REA는 Node.js **22.19 이상**, **24.11 이상**, 또는 **26 이상**을 지원한다. Node.js 23·25 및 사전 릴리스는 지원 범위가 아니다.[2]

```bash
node --version
npm --version
```

Node.js가 없거나 지원 범위 밖이면 공식 Node.js LTS를 설치한 뒤 터미널을 새로 연다.

## 2. 설정 변경 없이 설치 계획 보기

REA는 선택한 에이전트에 MCP 서버와 작업 지침(스킬)을 등록할 수 있다. 먼저 변경을 적용하지 않는 계획을 검토한다.

```bash
npx -y rea-agents@latest setup --dry-run
```

특정 에이전트로 범위를 좁히려면 해당 클라이언트 ID를 지정한다. 예를 들어 Codex는 다음과 같다.

```bash
npx -y rea-agents@latest setup --client codex --dry-run
```

설정은 감지된 에이전트 전체를 자동 선택하지 않으며, 선택한 대상의 경로와 변경 계획을 보여 준 뒤 승인을 요구한다. `--all-detected`는 모든 감지 클라이언트를 연결하려는 경우에만 사용한다.[2]

## 3. 에이전트에 REA 연결

검토 결과가 적절하면 대화형 설정을 실행한다.

```bash
npx -y rea-agents@latest setup
```

설정 화면에서 다음을 확인한다.

1. 연결할 에이전트만 선택한다.
2. MCP 등록 파일과 스킬 설치 경로를 검토한다.
3. 선택적 Hopper 설치 여부는 별도 승인으로 판단한다.
4. 완료 후 설정한 에이전트를 완전히 재시작한다.

전역 CLI를 유지하고 싶다면 다음처럼 설치한다.

```bash
npm install --global rea-agents
rea --help
rea setup
```

업데이트는 전역 설치를 소유한 패키지 관리자 기준으로 실행한다.

```bash
rea update
```

## 4. 준비 상태 확인

설치 직후에는 실제 분석 전에 `doctor`로 에이전트 연결과 분석 엔진 준비 상태를 확인한다.

```bash
rea doctor --json
```

특정 에이전트 연결만 확인하는 예시는 다음과 같다.

```bash
rea doctor --client codex --json
```

`doctor`는 읽기 전용 진단이며, 등록·스킬·분석 엔진의 상태를 구분해 보여 준다. 전체 상태가 완전히 정상이지 않아도, 선택한 정적 분석 작업은 가능할 수 있으므로 필요한 작업 범위의 결과를 확인한다.[2]

## 5. 권장 첫 분석: JavaScript·Electron 앱

처음에는 직접 소유하거나 공개적으로 분석이 허용된 JavaScript/Electron 앱을 정적 분석 대상으로 삼는다. 이 경로는 네이티브 분석 엔진 없이 시작할 수 있다.[1]

```bash
npx -y rea-agents@latest analyze-javascript-application "D:/경로/내-앱" --json
```

에이전트에 연결했다면 질문도 기능 단위로 한정한다.

```text
내가 소유한 D:/경로/내-앱의 검색 기능을 분석해 줘.
확인된 관찰 결과와 추론, 아직 확인하지 못한 부분을 구분해 줘.
관련 모듈·데이터 흐름·호출 관계를 먼저 제시하고, 구현 제안은 그 다음에 해 줘.
```

| 권장 질문 | 피할 질문 |
|---|---|
| “검색 결과 정렬은 어느 모듈에서 결정되는가?” | “이 상용 앱을 똑같이 복제해 줘.” |
| “renderer와 main process 사이의 IPC 흐름은 무엇인가?” | “라이선스 검사를 제거해 줘.” |
| “확인된 증거와 불확실성은 무엇인가?” | “분석 결과만으로 바로 배포해도 되는가?” |

## 6. 네이티브 `.exe`·`.dll` 분석: Windows의 제한된 경로

네이티브 분석에는 Hopper·Ghidra·IDA 같은 분석 엔진이 필요하다.[1] Windows의 Ghidra 지원은 공식 문서에서 실험적 P0로 정의되어 있다. 지원 대상, 사전 조건, 읽기 전용 작업 범위가 제한되며 일반적인 Windows 기능 동등성을 의미하지 않는다.[3]

권한이 있는 작은 표본으로 시작할 때의 준비 예시는 다음과 같다.

```powershell
npm install --global rea-agents
$env:GHIDRA_INSTALL_DIR = "C:\tools\ghidra_12.1.4_PUBLIC"
$env:JAVA_HOME = "C:\tools\jdk-21"
$env:REA_ANALYSIS_PROVIDER = "ghidra"

rea doctor --json
rea inspect "C:\경로\sample.exe" --provider ghidra --format json
```

- Ghidra는 사용자가 설치한 배포본을 사용한다.
- 문서상 Windows P0는 Ghidra 12.1.x와 호환 JDK를 전제로 한다.
- 분석은 읽기 전용이더라도 신뢰할 수 없는 대상의 실행·런타임 관찰은 별도 위험을 가진다.
- 복잡한 상용 데스크톱 프로그램 전체가 아니라, 직접 빌드한 작은 `.exe` 또는 허가된 표본으로 먼저 검증한다.[3][4]

## 7. 결과를 사용하는 원칙

REA의 결과는 원본 소스 코드나 기능 동등성을 보장하지 않는다. 다음 순서로 사용한다.

1. **관찰**: 문자열·모듈·함수·호출 관계에서 실제로 확인한 사실을 본다.
2. **해석**: 에이전트가 사실을 바탕으로 제시한 기능 가설을 분리한다.
3. **검증**: Evidence의 범위·한계와 독립 테스트 계획을 확인한다.
4. **재구현**: 원본을 복사하지 않고 우리 요구사항과 기술 스택에 맞춰 독립 구현하고 테스트한다.

REA는 분석 결과와 Evidence·한계를 함께 다루도록 설계됐지만, 디컴파일·휴리스틱·AI 해석은 불완전하거나 부정확할 수 있다. 중요한 기술·보안·법적 판단은 사람이 근거를 검토하고 독립적으로 검증해야 한다.[1][4]

## 최소 운영 체크리스트

- [ ] 대상의 소유권·분석 허가·데이터 처리 권한을 확인했다.
- [ ] `setup --dry-run` 결과에서 설정 변경 경로를 검토했다.
- [ ] 필요한 에이전트만 선택해 MCP를 연결했다.
- [ ] `rea doctor --json`으로 필요한 작업의 준비 상태를 확인했다.
- [ ] 처음에는 정적 분석과 작은 허가 표본으로 시작했다.
- [ ] Evidence의 관찰 사실·추론·미확인 부분을 분리했다.
- [ ] 런타임·네트워크·기기 관찰 전에는 별도 승인, 격리, 자격 증명 분리, 캡처물 보관 정책을 적용했다.

## Sources

[1] https://github.com/morluto/rea — morluto/rea README
[2] https://github.com/morluto/rea/blob/main/docs/installation.md — REA 설치·설정 문서
[3] https://github.com/morluto/rea/blob/main/docs/windows-ghidra-p0.md — REA Windows Ghidra P0 문서
[4] https://github.com/morluto/rea/blob/main/DISCLAIMER.md — REA 책임 있는 사용 고지
