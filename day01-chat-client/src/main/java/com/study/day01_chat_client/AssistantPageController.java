package com.study.day01_chat_client;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AssistantPageController {

    @GetMapping("/")
    public String home() {
        return "redirect:/assistant";
    }

    @GetMapping("/assistant")
    public String assistant() {
        return "forward:/assistant.html";
    }
}
