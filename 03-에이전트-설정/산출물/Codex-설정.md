# Codex 설정

## 범위와 근거

Codex에서 재사용 가능한 스킬을 설치·발견·호출하는 기본 구조를 정리한다. 여기서는 `mattpocock/skills`의 설치와 첫 호출만 다루며, MCP·훅·권한·조직 배포의 상세 설정은 범위에서 제외한다.

- 반영 사례: [Matt Pocock Skills와 AI 코딩 루프](../사례/2026-10-17-MINDUNG-Matt-Pocock-Skills와-AI-코딩-루프.md)
- 공식 문서 확인일: 2026-10-18
- 검증 범위: 현재 공식 문서와 저장소 README의 설치·호출 설명을 대조했다. 이 연구 저장소의 Codex 환경에 플러그인을 실제 설치하지는 않았다.

## 1. 개념 구분

| 대상 | 역할 |
|---|---|
| Skill | 특정 작업을 위한 지침·참조 자료·선택적 스크립트를 담은 재사용 워크플로 |
| Plugin | 여러 스킬과 선택적 MCP 서버·훅 등을 묶어 설치·배포하는 단위 |
| Marketplace | 설치 가능한 플러그인 목록과 가져올 위치를 제공하는 카탈로그 |

Codex는 스킬 이름·설명·경로를 초기 문맥에 제공하고, 사용할 때 전체 `SKILL.md`를 읽는 점진적 공개 방식을 사용한다.[7] 스킬이 많으면 설명이 축약되거나 일부가 초기 목록에서 빠질 수 있으므로, 범위가 뚜렷한 짧은 설명이 중요하다.[7]

## 2. `mattpocock/skills` 설치

저장소 README가 제시하는 Codex 플러그인 설치 명령은 다음과 같다.[3]

```bash
codex plugin marketplace add mattpocock/skills
codex plugin add mattpocock-skills@mattpocock
```

명령의 의미는 다음과 같다.

1. 첫 명령은 `mattpocock/skills`를 플러그인 marketplace로 등록한다.
2. 둘째 명령은 marketplace에 등록된 `mattpocock-skills` 플러그인을 설치한다.
3. 설치 후에는 **새 Codex 세션을 시작**해야 플러그인에 포함된 스킬과 도구를 사용할 수 있다.[8]

Codex CLI에서는 `/plugins`로 플러그인 브라우저를 열어 설치 상태를 확인할 수 있다.[8] 플러그인은 스킬 외에 MCP 서버나 훅을 포함할 수 있으므로, 설치 전에 구성 요소와 권한 영향을 검토한다.[8]

## 3. 설치 후 첫 작업

이 저장소 README는 저장소별 초기 설정을 위해 `setup-matt-pocock-skills`를 한 번 실행하도록 안내한다. 이 과정은 이슈 트래커, triage 라벨, 생성 문서의 저장 위치를 묻는다.[3]

Codex에서는 명시 호출할 스킬을 `$`로 언급한다.[7] 따라서 설치된 스킬 목록에서 실제 이름을 확인한 뒤 다음처럼 시작한다.

```text
$setup-matt-pocock-skills
```

스킬 이름은 설치된 버전이나 호스트의 표시에 따라 달라질 수 있으므로, `$` 입력 시 제안 목록 또는 `/skills`에서 표시되는 이름을 우선한다.[7] 설정을 마친 뒤 기본적인 변화 작업은 다음 순서로 시험할 수 있다.

```text
$grill-with-docs
→ 질문에 답해 요구사항·용어·결정을 정리
→ $implement 또는 명세·티켓 기반 구현 흐름 선택
→ 테스트가 필요한 경우 tdd 스킬의 적용 여부와 결과를 확인
```

`grill-with-docs`, `implement`처럼 사용자 호출로 설계된 스킬은 명시 호출을 기본으로 본다. 반면 `tdd`, `code-review` 등의 모델 호출 스킬은 작업 설명이 맞을 때 Codex가 선택할 수 있다. 명시 호출이 필요한지와 자동 적용 가능한지는 각 스킬의 메타데이터와 설치된 목록으로 확인한다.[3][7]

## 4. 로컬 스킬과 플러그인 중 선택

| 상황 | 우선 선택 | 이유 |
|---|---|---|
| 개인 실험·한 저장소에서 작은 절차를 시험 | 로컬 Skill | `.agents/skills`에 두고 빠르게 수정·검증할 수 있다. |
| 여러 스킬을 묶어 팀·여러 프로젝트에 배포 | Plugin + Marketplace | 설치·업데이트·구성 요소 관리를 하나의 배포 단위로 묶는다. |
| 외부 도구 연결·훅도 함께 배포 | Plugin | 스킬과 MCP 서버·훅을 함께 제공할 수 있다. |

Codex는 현재 작업 디렉터리에서 저장소 루트까지의 `.agents/skills`와 사용자·관리자·시스템 수준의 스킬 위치를 탐색한다.[7] 따라서 이 연구 저장소처럼 특정 저장소에서만 유지할 절차는 `.agents/skills/`가 적합할 수 있고, 외부 공개 스킬 묶음을 그대로 받아 사용할 때는 플러그인 설치가 적합하다.

## 5. 최소 확인 체크리스트

- [ ] marketplace 등록과 plugin 설치가 모두 완료되었는지 확인한다.
- [ ] 설치 직후 새 Codex 세션을 시작한다.
- [ ] `/plugins` 또는 `/skills`에서 설치된 플러그인·스킬의 실제 표시 이름을 확인한다.
- [ ] 첫 작업에서 `$setup-matt-pocock-skills`로 저장소별 문서 위치와 작업 관리 방식을 정한다.
- [ ] 부작용이 있는 스킬·훅·MCP 서버는 실행 권한과 연결 대상부터 검토한다.
- [ ] 스킬이 생성한 문서·테스트·변경을 실제 저장소 규칙과 실행 결과로 검증한다.

## Sources

[3] https://raw.githubusercontent.com/mattpocock/skills/main/README.md
[7] https://developers.openai.com/codex/skills
[8] https://developers.openai.com/codex/plugins
