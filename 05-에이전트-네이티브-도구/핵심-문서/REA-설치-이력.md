# REA 설치 이력

## 설치 목적

- REA(Reverse Engineer Anything)를 **Codex**와 연결해, 권한이 있는 로컬 대상의 분석에 사용한다.
- 대상의 라이선스·소유권·분석 허가를 확인한 범위에서만 사용한다.

## 환경

| 항목 | 값 |
|---|---|
| 운영체제 | Windows 11 (10.0.26200.9711) |
| 대상 에이전트 | Codex |
| Node.js | v22.23.2 |
| npm | 10.9.8 |
| 설치 방식 | `npx` 기반 대화형 설정 예정 |

## 진행 이력

| 일시 (KST) | 단계 | 수행 내용 | 결과 | 비고 |
|---|---|---|---|---|
| 2026-10-19 16:06 | 초기화 | 설치 이력 문서를 생성했다. | 진행 중 | 아직 REA·에이전트 설정 변경 없음 |
| 2026-10-19 16:08 | 1. 사전 조건 확인 | `node --version`, `npm --version`을 실행했다. | 통과 | Node.js v22.23.2, npm 10.9.8 — REA 지원 범위 충족 |
| 2026-10-19 16:09 | 2. 변경 계획 검토 | `npx --yes rea-agents@latest setup --client codex --dry-run`을 실행했다. | 검토 완료 | REA 6.7.0이 `C:\Users\ParkJuYeong\.codex\config.toml`에 MCP를 추가하고, 변경 전 `config.toml.rea.backup`을 생성할 계획이다. REA 스킬은 `C:\Users\ParkJuYeong\.agents\skills\reverse-engineer-anything`에 설치 예정이다. dry-run이라 실제 변경은 없었다. |
| 2026-10-19 16:10 | 3. Codex 연동 설치 | `npx --yes rea-agents@latest setup --client codex`을 실행하고 두 변경을 승인했다. | 설치 완료 | Codex MCP 등록, REA 스킬, 설정 백업의 존재를 확인했다. REA가 Codex 재시작을 요구했다. |
| 2026-10-19 16:28 | 4. 준비 상태 진단 | `npx --yes rea-agents@latest doctor --client codex --json`을 실행했다. | Codex 연동 통과 | `healthy: true`, Codex 등록 상태 `aligned`, REA 스킬 상태 `aligned`(버전 42)이다. 분석 엔진은 아직 설치·설정하지 않았다. |
| 2026-10-19 16:32 | 5. Codex 실연결 검증 | 재시작한 Codex에서 REA `binary_session` MCP 도구를 호출했다. | 통과 | REA 6.7.0 서버가 응답했다. MCP 도구 207개 중 현재 77개가 사용 가능하며, 열린 분석 대상은 없다. |

## 확인된 변경 범위

- Codex 설정에 REA MCP 등록을 추가한다. 실행 명령은 `cmd.exe /d /c npx -y rea-agents@6.7.0 mcp`다.
- 기존 `config.toml`의 무관한 설정은 보존하고, 변경 전 백업을 만든다.
- Node.js·npm·Java·Ghidra를 설치하거나 업그레이드하지 않는다.
- `prebuild-install@7.1.3`의 npm 사용 중단 경고가 출력됐으나, dry-run은 정상 완료됐다.

## 문서 보완 사항

실제 설치가 전역 CLI 설치 없이 `npx` 방식으로 진행됐으므로, `REA-설치-사용법.md`를 다음처럼 보완했다.

- Codex 단독 설치 명령에 `--client codex`를 명시했다.
- `npx` 설치 방식의 준비 상태 진단 명령을 추가했다.
- 스킬 정렬 상태를 준비 조건에 포함하도록 `doctor` 명령에 `--skill`을 추가했다.

## 진단 결과 해석

- `healthy: true`는 이번에 요구한 Codex MCP 등록이 정상임을 뜻한다.
- `environment_healthy: false`는 Hopper·Ghidra·IDA·JADX·Kuna 같은 분석 엔진이 아직 없다는 정보성 상태다. Codex MCP 연동 실패를 뜻하지 않는다.
- 다른 에이전트의 `config_drift`·`missing`은 이번 설치 범위(`--client codex`) 밖의 항목이므로 수정하지 않았다.
- Windows 호스트에서 현재 사용 가능한 77개 작업에는 아티팩트·.NET 정적 분석, JavaScript/Electron·웹 분석, 브라우저 관찰, Frida, 패킷 캡처 분석, 증거 비교·검증이 포함된다.
- Ghidra·IDA·Kuna는 미설정이며, Hopper와 macOS 전용 기능은 이 Windows 호스트에서 사용할 수 없다. `available: true`는 작업 자체의 현재 가용성을 뜻하며 대상 파일·실행 중 연결의 존재를 보장하지 않는다.

## 다음 단계

1. 분석 권한이 있는 작은 JavaScript/Electron 앱 또는 웹 분석 대상을 하나 정하고, 절대 경로 또는 URL을 기록한다.
