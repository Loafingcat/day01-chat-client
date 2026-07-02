# day01-chat-client

Spring Boot와 Spring AI 기반의 로컬 학습 도우미 프로젝트입니다. AI 모델은 Ollama의 `qwen2.5:7b`를 사용합니다.

## 사전 준비

- Java 21
- Ollama 실행 환경
- Ollama 서버 주소: `http://localhost:11434`

모델 저장 위치를 D 드라이브로 바꾸고 싶다면 Windows 환경 변수에 다음 값을 추가합니다.

```text
OLLAMA_MODELS=D:\ollama-models
```

환경 변수를 바꾼 뒤에는 Ollama를 완전히 종료하고 다시 실행합니다.

모델 다운로드:

```powershell
ollama pull qwen2.5:7b
ollama pull nomic-embed-text
ollama list
```

모델 실행 확인:

```powershell
ollama run qwen2.5:7b
```

Ollama API 확인:

```powershell
$body = @{
  model = "qwen2.5:7b"
  prompt = "Spring AI가 무엇인지 한 문단으로 설명해줘"
  stream = $false
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:11434/api/generate" -Method Post -Body $body -ContentType "application/json"
```

## 실행 방법

Ollama가 먼저 실행 중이어야 합니다.

Windows PowerShell:

```powershell
.\gradlew.bat bootRun
```

다른 셸:

```powershell
./gradlew bootRun
```

## 데이터 플랫폼 학습 도우미 UI

접속 주소:

```text
http://localhost:8080/assistant
```

`/`로 접속하면 `/assistant`로 이동합니다.

사용 방법:

- 질문 입력 후 전송
- Enter로 전송, Shift + Enter로 줄바꿈
- 빠른 질문 버튼으로 자주 묻는 주제 실행
- 학습 모드 버튼으로 쉬운 설명, 기술 설명, 면접 답변, 코드 위치, 꼬리질문, 답변 피드백 요청
- AI 답변 복사
- 최근 질문 재사용
- 대화 초기화

응답이 오지 않으면 Ollama 서버가 실행 중인지 확인합니다. 모델이 없으면 `ollama pull qwen2.5:7b`를 먼저 실행합니다.

## API 테스트

메인 assistant endpoint:

```http
POST /api/assistant/chat
Content-Type: application/json

{
  "message": "이 프로젝트에서 Kafka를 왜 쓰는지 설명해줘"
}
```

PowerShell:

```powershell
$body = @{
  message = "upsert가 뭐고 이 프로젝트에서는 왜 필요해?"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/assistant/chat" -Method Post -Body $body -ContentType "application/json"
```

응답 형식:

```json
{
  "answer": "..."
}
```

기존 GET endpoint도 유지합니다.

```text
GET /api/chat?message=hello
GET /api/teacher?message=Spring AI 설명해줘
```

## RAG TODO

이번 UI 작업에서는 RAG를 구현하지 않았습니다. 이후 작업 후보는 다음과 같습니다.

- data-platform 문서 Markdown 로딩
- chunking
- Ollama `nomic-embed-text` embedding 생성
- pgvector 저장
- 질문과 유사한 문서 검색
- 검색 context 기반 답변 생성
