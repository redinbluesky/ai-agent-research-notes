# plan.md — 구현·검증 계획

## 목적

`plan.md`는 구현 전에 코드베이스를 분석해 변경 파일, 작업 순서, 검증, 위험과 롤백을 검토 가능한 계획으로 만드는 문서다. 완성된 diff가 아니라 구현 전에 사람과 AI가 함께 검토하는 산출물이다.

## 출처에서 확인한 내용

- 에이전트는 계획 모드에서 승인된 `intent.md`와 `spec.md`를 읽고, 변경할 파일·작업 순서·검증 방법을 포함한 구현 계획을 만들 수 있다.[8]
- 엔지니어는 코드 생성 전에 계획을 검토·수정하고, 승인된 계획을 `plan.md`로 커밋한다.[8]
- 구현이 계획에서 벗어나면 같은 변경에서 `plan.md`를 갱신하며, PR 리뷰는 최종 diff를 계획과 비교해 확인할 수 있다.[8]

## 실무 가이드

### 1. 변경 대상과 이유를 적는다

파일·컴포넌트·서비스별로 무엇을 바꾸는지와 그 이유를 적는다. 직접 변경하지 않는 다운스트림 시스템, 데이터 계약, 인프라 영향도 함께 검토한다.

### 2. 위험을 앞쪽에 둔다

작업 순서는 의존성뿐 아니라 위험을 고려한다. 인증, 데이터 마이그레이션, 외부 연동, 되돌리기 어려운 변경은 검증 경로와 대안을 먼저 정한다.

### 3. 검증을 완료 조건으로 만든다

lint, build, unit·integration·E2E/UI, 보안, 성능, 마이그레이션 검증 중 해당되는 항목과 통과 기준을 쓴다. 테스트가 없는 영역은 검증할 수 없는 위험으로 명시한다.

### 4. 배포와 롤백을 계획에 포함한다

점진 배포, 기능 플래그, 모니터링 지표, 중단·롤백 조건, 데이터 복구 절차를 필요한 수준으로 작성한다. 실제 배포 통제는 [CI/CD와 안전한 배포](CI-CD와-안전한-배포.md) 가이드를 따른다.

### 5. 구현 중 달라진 판단을 반영한다

코드베이스 조사나 구현 과정에서 계획이 바뀌면 변경 내용과 이유를 `plan.md`에 기록한다. 계획이 실제 변경과 달라진 채로 남지 않게 한다.

## 권장 템플릿

```md
# Plan: [기능 이름]

Related intent: [intent.md 경로]
Related spec: [spec.md 경로]

## Scope

## Files and components to change
- `[경로]`: 변경 이유

## Implementation steps
1.

## Validation plan
- [ ] Lint
- [ ] Build
- [ ] Unit / integration tests
- [ ] E2E or UI verification
- [ ] Security / migration checks

## Rollout and rollback plan

## Risks, alternatives, and open questions
```

## 권장 지표

- 계획 승인부터 병합까지 걸린 시간
- 첫 구현 패스에서 병합된 변경 비율
- 구현 중 발생한 `plan.md` 변경 횟수
- 병합된 diff가 승인된 계획과 일치하는 비율

## 점검 목록

- [ ] 변경 파일·컴포넌트·영향 범위가 명시됐는가?
- [ ] 작업 순서와 의존성이 설명됐는가?
- [ ] 검증 항목과 통과 기준이 있는가?
- [ ] 보안·데이터·성능·운영 위험을 검토했는가?
- [ ] 배포·롤백 계획이 필요한 변경인가?
- [ ] 구현 중 달라진 계획을 함께 갱신했는가?

## Sources

[8] https://academy.claude.com/courses/ai-native-sdlc-playbook/plan-mode — Claude Code plan mode as the default starting point
