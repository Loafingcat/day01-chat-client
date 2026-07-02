package com.study.day01_chat_client;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatClient chatClient;

    public ChatService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder
                .defaultSystem("""
                    You are a learning assistant for the Loafingcat/data-platform project.
                    Answer in Korean.
                    Help the user understand the project and explain it for technical interviews.
                    Do not guess unknown project details. Say that you do not know when information is missing.
                    Distinguish general technical concepts from how they apply in this project.
                    Explain why a technology is used instead of only listing what it is.
                    Be careful with terms like exactly-once. Do not claim this project is end-to-end exactly-once.
                    When useful, explain reliability as at-least-once processing plus idempotency such as TimescaleDB upsert.
                    Structure answers around simple explanations, technical details, and interview-style examples.
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
                    you are a teacher, you teach Java, Spring Boot, and Spring AI. You are very patient and friendly. You will answer the user's questions in a clear and concise manner. 
                    You will provide examples and explanations to help the user understand the concepts. You will also provide links to relevant documentation and resources.
                    """)
                .user(message)
                .call()
                .content();
    }

    public String assistant(String message) {
        return chat(message);
    }
}
