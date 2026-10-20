# Hermes와 Aside 공유 로컬 모델 연동 — local-strata 사례

## 출처 정보

| 항목 | 내용 |
|---|---|
| 출처 | 사용자 실제 환경에서의 설치·연동 과정 (Hermes Desktop, Aside Desktop) |
| 게시자·작성자 | 사용자 실행, 에이전트 검증 |
| 발행일 | 2026-10-19 |
| 출처 유형 | 실제 운영 사례 (직접 실행 + 파일·로그 검증) |
| 관련 문서 | [Aside 설치·사용법](../../05-에이전트-네이티브-도구/핵심-문서/Aside-설치-사용법.md) |

## 한 줄 결론

Hermes의 Custom Endpoint `local-strata`(`http://127.0.0.1:8080/v1`)를 Aside의 custom provider로 등록해, 두 에이전트가 **같은 로컬 엔드포인트·같은 모델**를 공유하는 구성이 완성되었다. 등록은 Aside 공식 문서에 없는 실험 경로로 진행했고, 저장·실호출·응답을 파일과 로그로 검증했다.[1][2]

## 확인된 사실

### 1. Hermes 쪽 설정 (사용자 제공)

| 항목 | 값 |
|---|---|
| Custom Endpoint 이름 | `local-strata` |
| 상태 | Active |
| 로컬 엔드포인트 | `http://127.0.0.1:8080/v1` |
| Hermes 기본 모델명 | `qwen3.8-flash-next-iq3_xxs` |

### 2. 엔드포인트 실측 (curl 검증)

- 서버: llama.cpp 계열, OpenAI Chat Completions 호환 (`/v1/chat/completions` 정상 응답)
- `/v1/models`가 실제로 반환하는 모델 ID: `qwen3.8-flash-next-iq2_xs`
- Function calling: 테스트 통과 (`tool_calls` 정상 반환)
- Reasoning: `reasoning_content` 출력 확인 (thinking 지원)
- `n_ctx = 65536`, input은 text만 (image modality 없음)

### 3. Aside 저장 경로 검증

Save 후 `C:\Users\ParkJuYeong\.aside\u\0\models.json`에 실제 반영됨:

```json
"local-strata": {
  "name": "Local Strata",
  "api": "openai-completions",
  "baseUrl": "http://127.0.0.1:8080/v1",
  "authHeader": false,
  "models": [{ "id": "qwen3.8-flash-next-iq2_xs", "reasoning": true, "contextWindow": 65536, "maxTokens": 8192, "input": ["text"] }]
}
```

(저장된 `apiKey` 값은 기록하지 않는다.)

### 4. 실호출 검증

Aside 세션 `<검증-세션>` 메시지 로그:

- user: `7×8 계산해줘`
- assistant: `7 × 8 = **56**` — 정답
- 해당 세션의 model 필드: `qwen3.8-flash-next-iq2_xs` (로컬 모델)

같은 날 다른 세션은 Aside 기본 모델(`gpt-6.1-sol`)로 응답한 것과 대비되어, Task models 선택이 정상 적용된 근거가 된다.

## 분석과 해석

> 이 절은 출처에서 직접 확인한 사실이 아니라 과정 해석이다.

1. **모델 ID 불일치 함정**: Hermes는 서버에 없는 모델명을 보내도 llama.cpp가 로드된 모델을 반환해 우회 작동하지만, Aside은 팝업에 입력한 모델 ID를 요청에 그대로 보낸다. 따라서 Aside에는 `/v1/models`가 실제로 반환한 ID(`qwen3.8-flash-next-iq2_xs`)를 써야 한다.
2. **custom provider는 문서화되지 않은 경로**: Aside Help Center에는 plan/subscription/API-key 제공자만 문서화되어 있다. 팝업 JSON 등록은 Pi 호환 provider 스키마 기반의 실험 경로로 취급해야 한다.[1][2]
3. **Context Warning 해석**: `@url:http://localhost:8080/#monitor: no content extracted`는 연동 오류가 아니라, SPA(#monitor)에서 활성 탭의 페이지 컨텍스트 추출 실패 안내다. 프롬프트 처리와 모델 호출에는 영향이 없었다(로그에서 답변 완료 확인).
4. **reasoning 플래그**: thinking 지원이 확인되어 `true`로 저장했다. Aside이 thinking 파라미터 전송 시 오류를 내면 `false`로 되돌린다.

## Aside 팝업 등록 구성 (비밀값 제외)

```json
{
  "providers": {
    "local-strata": {
      "name": "Local Strata",
      "api": "openai-completions",
      "baseUrl": "http://127.0.0.1:8080/v1",
      "authHeader": false,
      "models": [
        {
          "id": "qwen3.8-flash-next-iq2_xs",
          "name": "Qwen3.8 Flash Next (Local)",
          "reasoning": true,
          "contextWindow": 65536,
          "maxTokens": 8192,
          "input": ["text"]
        }
      ]
    }
  }
}
```

## 재현 절차

1. Aside `MODELS 메뉴 → +Connect → +Add custom provider` 팝업에 위 구성을 입력하고 인증 필드는 사용법에 따라 별도로 설정 → Save
2. `Settings > Models > Task models`에서 로컬 모델을 default로 선택
3. 단순 계산 프롬프트("7×8 계산해줘")로 응답 확인
4. 검증: `models.json`에 프로바이더 존재 확인 + 세션 로그의 model 필드 확인

## 기존 연구 주제와의 연결

- `05-에이전트-네이티브-도구`: Aside custom provider 등록 원칙은 [Aside 설치·사용법](../../05-에이전트-네이티브-도구/핵심-문서/Aside-설치-사용법.md)의 "로컬 OpenAI 호환 서버를 Custom Provider로 연결" 절에 반영되었다.
- `03-에이전트-설정`: 제품별 설정 자체(모델명 불일치 함정, warning 해석)는 이 사례에 둔다.

## Sources

[1] https://docs.aside.com/help/ai (문서화된 제공자 유형: plan/subscription/API-key)
[2] https://github.com/earendil-works/pi/blob/c779c14e91bc2ea65143e59b0dc1baf3646ba8c9/packages/coding-agent/docs/custom-provider.md (Pi 호환 provider JSON 스키마)
[3] 실제 검증 대상: `C:\Users\ParkJuYeong\.aside\u\0\models.json`, `C:\Users\ParkJuYeong\.aside\u\0\sessions\<검증-세션>\messages.jsonl`, `http://127.0.0.1:8080/v1/models`
