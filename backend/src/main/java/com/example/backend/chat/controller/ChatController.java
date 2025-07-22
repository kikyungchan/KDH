package com.example.backend.chat.controller;

import com.example.backend.chat.dto.ChatForm;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatController {

    private final SimpMessagingTemplate template;


    public ChatController(SimpMessagingTemplate template) {
        this.template = template;
    }


    @MessageMapping("/chat/private")
    public void sendPrivateMessage(ChatForm msg, Principal principal) {
        template.convertAndSendToUser(
                msg.getTo(),
                "/queue/messages",
                msg
        );
    }
}
