package com.study.day01_chat_client;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/chat")
    public String chat(@RequestParam String message) {
        return chatService.chat(message);
    }

    @GetMapping("/teacher")
    public String teacher(@RequestParam String message) {
        return chatService.teacher(message);
    }

    @PostMapping(
            value = "/assistant/chat",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = "application/json;charset=UTF-8"
    )
    public ChatResponse assistantChat(@RequestBody ChatRequest request) {
        if (request.message() == null || request.message().isBlank()) {
            return new ChatResponse("질문을 입력해 주세요.");
        }

        return new ChatResponse(chatService.assistant(request.message()));
    }
}
