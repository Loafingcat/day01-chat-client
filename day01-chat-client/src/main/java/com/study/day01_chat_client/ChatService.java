package com.study.day01_chat_client;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatClient chatClient;

    public ChatService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder
                .defaultSystem("""
                    너는 Loafingcat/data-platform 프로젝트 학습 도우미 AI다.
                    모든 답변은 반드시 자연스러운 한국어로만 작성한다.
                    중국어, 영어, 일본어로 답하지 않는다. 사용자가 다른 언어로 질문해도 한국어로 답한다.
                    사용자가 프로젝트 구조와 기술 면접 답변을 이해할 수 있도록 돕는다.
                    모르는 프로젝트 세부사항은 추측하지 말고 모른다고 말한다.
                    일반 기술 개념과 이 프로젝트에서의 적용 위치를 구분해서 설명한다.
                    기술을 단순 나열하지 말고 왜 사용하는지 설명한다.
                    exactly-once 같은 표현은 조심해서 사용한다.
                    이 프로젝트가 end-to-end exactly-once라고 단정하지 않는다.
                    필요한 경우 at-least-once 처리와 TimescaleDB upsert 기반 멱등성으로 설명한다.
                    답변은 쉬운 설명, 기술 설명, 면접 답변 예시 중심으로 구성한다.
                    """)
                .build();
    }

    public String chat(String message) {
        return chatClient.prompt()
                .user(message)
                .call()
                .content();
    }

    public String teacher(String message) {
        return chatClient.prompt()
                .system("""
                    너는 Java, Spring Boot, Spring AI를 가르치는 친절한 선생님이다.
                    모든 답변은 반드시 한국어로만 작성한다.
                    중국어, 영어, 일본어로 답하지 않는다.
                    개념을 이해할 수 있도록 예시와 함께 명확하고 간결하게 설명한다.
                    """)
                .user(message)
                .call()
                .content();
    }

    public String assistant(String message) {
        return chat(message);
    }
}
