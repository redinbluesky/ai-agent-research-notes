# spec.md — 요구사항과 설계 명세

## 목적

`spec.md`는 승인된 `intent.md`를 구현 가능한 요구사항과 설계로 구체화한다. 무엇을 만들지뿐 아니라 무엇을 만들지 않을지, 어떤 정책과 위험을 고려할지를 기록한다.

## 출처에서 확인한 내용

- 제품 책임자가 승인한 `intent.md`를 입력으로 AI가 요구사항과 설계 명세 초안을 만들고, 조직의 브랜드·보안·컴플라이언스·UX 규칙을 제약으로 적용할 수 있다.[7]
- 제품 책임자는 명세가 원래 문제를 해결하는지 검토하고, 미해결 질문과 정책 충돌을 적절한 책임자에게 연결한다.[7]
- 승인된 `spec.md`는 다음 구현 계획 단계의 입력이며, 고위험 변경의 진행 여부는 사람이 결정한다.[7]

## 실무 가이드

### 1. 목표와 비목표를 함께 정의한다

Goals에는 이번 변경이 달성할 사용자·비즈니스·기술 결과를 쓴다. Non-goals에는 의도적으로 다루지 않는 범위를 적어 기능 팽창을 막는다.

### 2. 요구사항을 검증 가능하게 쓴다

기능 요구사항, 사용자 흐름, 예외 상황, 오류 처리, 수용 기준을 구분한다. 수용 기준은 이후 테스트와 PR 검토에서 확인 가능한 문장으로 작성한다.

### 3. 시스템 영향을 빠뜨리지 않는다

API, 데이터 모델, 이벤트, 권한, 외부 연동, 마이그레이션, 성능, 관측성에 대한 영향을 검토한다. 영향이 없다고 판단했을 때도 그 근거를 남긴다.

### 4. 정책 충돌과 고위험 결정을 분리한다

보안, 개인정보, 컴플라이언스, 비용, UX 요구가 충돌하면 구현 단계로 미루지 않는다. 관련 정책 책임자와 결정 사항을 명시한다.

### 5. intent와의 추적성을 유지한다

관련 `intent.md`와 이슈를 링크하고, 핵심 요구사항이 intent의 어떤 결과를 만족하는지 확인한다. 구현 시작 후 요구사항이 바뀌면 이유와 승인 기록을 남긴다.

## 권장 템플릿

```md
# Spec: [기능 이름]

Related intent: [intent.md 경로]
Status: draft

## Goals

## Non-goals

## Functional requirements

## User flows / UX

## Technical design

## Data and API changes

## Security, privacy, and performance

## Observability and operations

## Acceptance criteria
- [ ]

## Open questions and decisions
```

## 권장 지표

- `intent.md` 승인부터 `spec.md` 승인까지 걸린 시간
- 첫 `plan.md` 작성 이후 발생한 spec 변경 횟수
- 요구사항 누락 때문에 발생한 재작업 비율

## 점검 목록

- [ ] intent의 문제와 기대 결과를 해결하는가?
- [ ] 목표와 비목표가 분리되어 있는가?
- [ ] 사용자 흐름·예외·오류 처리가 정의되어 있는가?
- [ ] API·데이터·권한·성능·관측성 영향을 검토했는가?
- [ ] 수용 기준이 테스트 가능하게 작성됐는가?
- [ ] 고위험 결정과 승인자가 명확한가?

## Sources

[7] https://academy.claude.com/courses/ai-native-sdlc-playbook/requirements-and-design — Requirements and design
