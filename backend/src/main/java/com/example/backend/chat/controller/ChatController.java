package com.example.backend.chat.controller;

import com.example.backend.chat.dto.ChatForm;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
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
        System.out.println("principal " + principal);
        System.out.println("msg " + msg);
        template.convertAndSendToUser(
                msg.getTo(),                // 받는 사용자 ID
                "/queue/messages",          // 구독 경로
                msg                         // 메시지 payload
        );
    }


   /* @MessageMapping("/chat/send")
    @SendTo("/topic/public")
    public void ChatMessage broadcast(ChatMessage msg) {
        // 받은 메시지를 그대로 /topic/public 구독자 모두에게 전송
        return msg;
    }*/
}
