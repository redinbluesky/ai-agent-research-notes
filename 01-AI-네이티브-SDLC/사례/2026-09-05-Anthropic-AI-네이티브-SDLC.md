---
title: Anthropic AI Native SDLC Playbook 영상 정리
source_type: youtube
author: 개발동생
published: 2026-09-05
url: https://youtu.be/4kXsF2S5MNY?si=Q5HAxpbCx1zJVud0
topics:
  - AI Native SDLC
  - intent.md
  - Claude Code
  - agent evals
status: reviewed
---

# 한줄 요약

AI가 코드만 작성하는 것이 아니라 계획·설계·테스트·배포·운영의 초안을 만들고, 사람은 승인과 고위험 판단에 집중하도록 개발 시스템을 재설계하는 방법론이다.

# 핵심 주장

1. AI 에이전트로 코드 작성 속도가 빨라지면서, 요구사항 검토·리뷰·테스트·배포·운영이 새 병목이 되었다.
2. 기능의 **의도**가 코드보다 먼저 남아야 리뷰와 의사결정이 쉬워진다.
3. `intent.md` → `spec.md` → `plan.md`을 통해 왜·무엇을·어떻게를 분리한다.
4. AI는 단계별 초안을 만들고, 사람은 승인·제품 판단·위험 판단을 맡는다.
5. 테스트와 CI는 코드뿐 아니라 AI의 규칙, 스킬, 훅에도 적용해야 한다.

# AI 네이티브 SDLC 6단계

| 단계 | AI 역할 | 사람 역할 | 대표 산출물 |
|---|---|---|---|
| 계획 | 질문·정리·intent 초안 | 문제·우선순위 승인 | `intent.md` |
| 설계 | 요구사항·설계·목업 초안 | 제품·설계 결정 승인 | `spec.md` |
| 구현 | 코드·테스트·계획 생성 | 아키텍처·범위 판단 | `plan.md`, 코드 |
| 테스트 | 테스트 실행·수정 반복·UI 검증 | 고위험 결과 확인 | 테스트/CI 결과 |
| 배포 | 다층 리뷰·정책 검사 | 위험 기반 승인 | 리뷰·배포 기록 |
| 운영 | 지표 분석·원인/해결안 초안 | 실제 조치 승인 | 회고·후속 PR |

# 적용 구조

```text
intent/
  기능-슬러그/
    intent.md
    spec.md
    plan.md
```

- 기능 의도 단위로 폴더 하나를 둔다.
- 폴더당 intent, spec, plan은 각각 하나만 둔다.
- spec이 여러 개 필요하다면 기능 또는 intent를 더 작은 단위로 분리한다.
- Intent PR → Spec PR → Feature PR 순으로 승인한다.

# 도입 시 유의사항

- 모든 작업에 문서 절차를 적용하지 않는다. 작고 자명한 수정은 바로 처리한다.
- `intent.md`는 업계 표준이나 자동 인식 예약 파일이 아니라 권장 양식이다.
- AI에게 최종 의사결정 권한을 부여하지 않는다.
- 이벤트 감지는 가능한 한 규칙 기반으로 하고, AI는 감지 이후 분석과 초안에 활용한다.

# 타임스탬프

- 00:45 — `intent.md`의 정의
- 08:02 — 전통 SDLC와 AI 네이티브 SDLC 비교
- 09:31 — 6단계: 계획·설계
- 11:12 — 빌드
- 11:58 — 테스트: TDD, 훅, evals
- 14:32 — 배포
- 15:12 — 운영
- 16:41 — AI 초안·사람 승인 원칙
- 22:18 — `CLAUDE.md`, `intent.md`, `spec.md`, `plan.md` 비교
- 29:16 — 실제 저장소 구조와 PR 흐름
- 34:21 — 단계적 도입

# 출처

- 영상: [Anthropic 제안한 코드 짜기 전에 무조건 쓰라는 파일 | AI 네이티브 SDLC 도입 정리](https://youtu.be/4kXsF2S5MNY?si=Q5HAxpbCx1zJVud0)
- 원문: [The AI Native SDLC Playbook](https://claude.com/blog/the-ai-native-sdlc-playbook)
