# 에이전트 실행 하네스

Spec-Driven Development의 설계 문서를 작은 실행 단계로 나누고, 각 단계를 독립된 Claude Code 세션에서 순차 실행하기 위한 참고 구현이다.

## 출처와 보관 기준

- 원본 저장소: https://github.com/jha0313/harness_framework
- 보관 기준 커밋: `da676bc689f10f6db38ff194cf25e983f59ac231`
- 관련 영상: https://www.youtube.com/watch?v=v6UAPUnOSxA
- 원본의 이용 조건을 확인한 뒤 연구·실행 참고용으로 저장했다.

이 폴더의 `CLAUDE.md`, `.claude/`, `docs/`, `scripts/`는 위 커밋의 파일을 보관한 것이다. 이 README는 현재 연구 저장소에서 출처, 실행 방식과 주의사항을 설명하기 위해 추가했다.

## 구조

```text
02-에이전트-실행-하네스/
├─ .claude/
│  ├─ commands/
│  │  ├─ harness.md
│  │  └─ review.md
│  └─ settings.json
├─ docs/
│  ├─ PRD.md
│  ├─ ARCHITECTURE.md
│  ├─ ADR.md
│  └─ UI_GUIDE.md
├─ scripts/
│  ├─ execute.py
│  └─ test_execute.py
├─ CLAUDE.md
└─ README.md
```

- `CLAUDE.md`: 기술 스택, 아키텍처 경계, 개발 명령 등 프로젝트 규칙
- `docs/`: PRD, 아키텍처, ADR, UI 가이드 템플릿
- `.claude/commands/harness.md`: 탐색, 논의, Step 설계, 파일 생성과 실행 절차
- `.claude/commands/review.md`: 아키텍처·기술 스택·테스트·빌드 검토 절차
- `.claude/settings.json`: 종료 시 검증과 일부 위험 명령 차단 훅
- `scripts/execute.py`: Step별 Claude 세션, 상태, 재시도, 브랜치와 커밋을 관리하는 실행기

## 기본 실행 흐름

1. `CLAUDE.md`와 `docs/*.md`를 대상 프로젝트에 맞게 작성한다.
2. Claude Code에서 `/harness`로 구현 작업을 자기 완결적인 Step으로 설계한다.
3. 생성된 `phases/<task-name>/step<N>.md`와 `index.json`을 검토한다.
4. 격리된 작업 브랜치와 깨끗한 작업 트리에서 실행한다.

```bash
python scripts/execute.py <task-name>
```

원본 실행기는 `--push` 옵션도 제공하지만, 기본 운용에서는 사용하지 않고 사람이 결과를 검토한 뒤 별도로 push하는 것을 권장한다.

## 테스트

실행기 테스트는 `pytest`를 일시적으로 설치해 실행할 수 있다.

```bash
uv run --with pytest python -m pytest scripts/test_execute.py -q
```

보관 시점에 51개 테스트가 통과했다. 이 테스트는 주로 실행기 내부 동작과 Claude·Git 호출 경계를 모킹한 단위 테스트이므로, 실제 저장소에서의 무인 실행을 보증하는 E2E 테스트는 아니다.

## 안전 주의사항

원본은 장시간 자동 실행 데모에 초점을 둔 구현이므로 실제 프로젝트에 적용하기 전에 다음을 검토한다.

- `scripts/execute.py`는 Claude Code를 `--dangerously-skip-permissions`로 실행한다. 샌드박스, 최소 권한, 네트워크 제한과 자격 증명 격리 없이 사용하지 않는다.
- 실행기는 작업 브랜치를 만들고 `git add -A`와 자동 커밋을 수행한다. 실행 전에 작업 트리가 깨끗한지 확인하고 별도 clone 또는 worktree를 사용한다.
- `--push`는 원격 상태를 변경한다. 사람의 명시적 검토와 승인을 거친 경우에만 사용한다.
- `.claude/settings.json`의 문자열 기반 위험 명령 차단은 실수 방지 장치일 뿐 보안 샌드박스가 아니다.
- 에이전트가 `index.json`에 기록한 `completed` 상태를 독립적인 검증 결과로 간주하지 않는다. 빌드·테스트·정적 분석을 별도 프로세스에서 다시 실행한다.
- API 키와 운영 자격 증명을 프롬프트, 터미널 인자, Step 파일 또는 Git 기록에 넣지 않는다.

## 연구 문서

영상과 구현체의 상세 분석은 [Spec-Driven Development와 에이전트 실행 하네스](../../01-AI-네이티브-SDLC/사례/2026-09-24-실밸개발자-Spec-Driven-Development.md)에서 확인한다.
