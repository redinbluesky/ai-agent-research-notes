# AI 코딩 스킬 비교: Matt Pocock, Addy Osmani, pstack

## 출처 정보

| 항목 | 내용 |
|---|---|
| 출처 | MINDUNG YouTube 영상 및 연결된 공개 스킬 저장소 |
| 게시자·작성자 | MINDUNG / Matt Pocock / Addy Osmani / Lauren Tan (poteto) |
| 발행일 | 2026-10-18 (영상) |
| 영상 길이 | 5분 6초 |
| 출처 유형 | 비교 영상, 오픈소스 스킬 저장소 |
| 영상 | <https://www.youtube.com/watch?v=8KxUBUm9Ciw> |
| 비교 대상 | <https://github.com/mattpocock/skills>, <https://github.com/addyosmani/agent-skills>, <https://github.com/cursor/plugins/tree/main/pstack> |

## 한 줄 결론

세 프로젝트는 모두 AI 코딩을 반복 가능한 작업 절차와 검증으로 바꾸려 하지만, **Matt Pocock은 의도 정렬과 빠른 피드백**, **Addy Osmani는 명시적 SDLC 품질 게이트**, **pstack은 고난도 실행·독립 검증·병렬 오케스트레이션**에 각각 중심을 둔다.[2][3][4]

## 영상 요약

영상은 AI 코딩 스킬을 요구사항, 구현, 검증의 세 단계로 나누어 비교한다.[1]

| 단계 | Matt Pocock Skills | Addy Osmani `agent-skills` | pstack |
|---|---|---|---|
| 요구사항 | 질문으로 모호함·용어·결정을 정렬 | `/spec`으로 요구를 문서화하고 다음 단계의 기준을 설정 | 기본값으로 긴 계획을 강제하지 않으며 작업별 플레이북을 선택 |
| 구현 | 작은 스킬 조합과 TDD·버그 진단 루프 | `/plan`과 `/build`로 작은 작업을 점진 구현 | `/poteto-mode`가 조사·버그·성능·기능·리팩터링 등 플레이북으로 라우팅 |
| 검증 | 테스트·타입·브라우저 피드백 강화 | `/test`, `/review`, `/ship` 품질 게이트 | 런타임 증거, 독립 검증, 장기·병렬 작업의 완료 관리 |

### Matt Pocock: 사람과 에이전트의 의도를 맞춘다

영상은 Matt Pocock의 접근을 “더 긴 명세”보다 먼저 요구의 빈칸을 질문으로 드러내는 방식으로 설명한다.[1] 저장소의 `grill-me`와 `grill-with-docs`는 작업 전 질문을 통해 의도를 정렬하고, 공유 용어와 결정 기록을 남기는 흐름을 제공한다. 이후 `tdd`, `diagnosing-bugs`, `code-review` 같은 스킬로 실행 피드백을 연결한다.[2][6]

### Addy Osmani: 개발 단계마다 품질 게이트를 둔다

`agent-skills`는 Define → Plan → Build → Verify → Review → Ship 흐름을 `/spec`, `/plan`, `/build`, `/test`, `/review`, `/ship` 명령에 대응시킨다.[3] 이 방식에서 핵심은 다음 단계로 넘어가기 전에 현재 단계의 산출물과 품질 기준을 검토하는 것이다. 예를 들어 스펙 주도 개발 스킬은 큰 변경을 명세 → 계획 → 작업 분해 → 구현으로 진행하고, 각 단계를 사람 검토와 연결하도록 안내한다.[5]

### pstack: 작업 유형에 맞춘 강한 실행·검증을 한다

pstack의 주 진입점 `/poteto-mode`는 작업을 읽고 조사, 버그 수정, 성능, 기능, 리팩터링, eval, 장기 자율 실행, 오케스트레이션 등 22개 플레이북 중 알맞은 흐름을 적용한다.[4] 저장소는 높은 코드 생산량보다 검증 가능한 고품질 코드와, 여러 에이전트를 신뢰성 있게 병렬로 운영하는 능력을 목표로 설명한다.[4]

## 저장소 문서로 확인한 비교

### 1. 해결하려는 주된 병목

| 관점 | Matt Pocock | Addy Osmani | pstack |
|---|---|---|---|
| 주된 실패 원인 | 사람과 에이전트가 같은 요구를 다르게 이해함 | 단계·품질 기준 없이 구현이 앞서는 문제 | 복잡한 작업에서 조사·실행·검증·병렬화가 약한 문제 |
| 기본 단위 | 질문, 공유 언어, 작은 피드백 루프 | SDLC 단계와 단계별 명령 | 작업 유형별 플레이북과 지속 모드 |
| 계획에 대한 태도 | 질문으로 의도와 결정을 먼저 명확화 | spec과 plan을 명시적 입력으로 사용 | 상황별로 계획을 적용하며 실행·검증 흐름을 강조 |
| 검증의 중심 | TDD·타입·브라우저·자동 테스트 | 테스트·리뷰·배포 전 품질 게이트 | 런타임 증거·독립 검증·장기 작업의 안전한 완료 |

### 2. 상호 대체가 아니라 보완 관계다

세 저장소가 제안하는 방식은 하나만 선택해야 하는 제품 기능이 아니다.[2][3][4] 다음처럼 병목에 따라 조합할 수 있다.

```text
요구가 모호함
  → Matt Pocock식 질문·공유 언어·결정 기록
명세와 작업 흐름이 불규칙함
  → Addy Osmani식 Spec → Plan → Build → Test → Review → Ship
고난도 버그·성능·장기 병렬 작업
  → pstack식 플레이북·런타임 증거·오케스트레이션
```

다만 세 체계를 통째로 동시에 설치·강제하면 같은 역할의 명령과 지침이 충돌하거나, 에이전트가 어떤 절차를 우선할지 불명확해질 수 있다. 저장소별로 모든 스킬을 도입하기보다 **현재의 측정 가능한 병목 하나에 대응하는 절차 하나부터** 시험하는 편이 안전하다.[2][3][4]

## 분석과 적용 기준

> 이 절의 내용은 영상이나 저장소가 직접 주장한 사실이 아니라, 위 자료를 이 연구 노트의 AI 네이티브 SDLC 관점에서 해석한 것이다.

1. **의도 오해가 재작업의 주된 원인이라면** Matt Pocock 방식의 질문·용어 정렬을 먼저 도입한다.[2] 구현 속도보다 spec 변경, 재작업, 요구 해석 차이를 관찰 지표로 둔다.
2. **팀마다 개발 단계와 리뷰 기준이 다르다면** Addy Osmani 방식에서 `spec`, `plan`, `test`, `review`의 최소 게이트를 채택한다.[3][5] 단, 오탈자·명백한 단순 수정까지 같은 절차를 강제하지 않는다.[5]
3. **재현이 어려운 버그·성능·장기 자율 작업이 많다면** pstack의 작업 유형별 플레이북과 독립 검증 방식을 참고한다.[4] 단, 이 저장소는 Cursor 플러그인으로 제공되므로 다른 에이전트에 그대로 이식된다고 가정하지 않는다.[4]
4. **스킬의 자동 적용은 권한 통제가 아니다.** 스킬은 절차를 안내하지만, 운영 배포·원격 push·비밀값 접근 같은 부작용 있는 행위는 별도의 최소 권한, 보호 브랜치, CI와 사람 승인으로 통제해야 한다.

## 기존 연구 주제와의 연결

- `03-에이전트-설정`: 스킬의 설치 위치, 호출 방식, 설명과 로딩 조건, 플러그인 구성 요소를 제품별로 검증하는 주제다. 이 사례는 세 스킬 체계의 역할 차이를 비교하는 보조 자료다.
- `01-AI-네이티브-SDLC`: Intent → Spec → Plan → 구현·검증 흐름과 연결된다. 특히 Addy Osmani의 단계 게이트는 기존 흐름의 운영상 대응물이고, Matt Pocock·pstack은 각각 정렬과 검증의 깊이를 보강한다.

## 타임스탬프

| 시각 | 내용 |
|---|---|
| 00:00 | AI 코딩 스킬이 서로 다른 이유 |
| 00:25 | 무엇을 만들지 결정하기: 요구사항 단계 |
| 01:49 | 코드 만들기와 수정: 구현 단계 |
| 03:07 | 결과 확인: 검증 단계 |
| 04:27 | 업무에 맞는 스킬 선택 기준 |

## Sources

[1] https://www.youtube.com/watch?v=8KxUBUm9Ciw
[2] https://github.com/mattpocock/skills
[3] https://github.com/addyosmani/agent-skills
[4] https://github.com/cursor/plugins/tree/main/pstack
[5] https://raw.githubusercontent.com/addyosmani/agent-skills/main/skills/spec-driven-development/SKILL.md
[6] https://raw.githubusercontent.com/addyosmani/agent-skills/main/skills/test-driven-development/SKILL.md
