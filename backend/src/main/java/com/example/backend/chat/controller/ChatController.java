package com.example.backend.chat.controller;

import com.example.backend.chat.dto.ChatForm;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatController {

    private final SimpMessagingTemplate template;


    public ChatController(SimpMessagingTemplate template) {
        this.template = template;
        System.out.println(template);
    }


    @MessageMapping("/chat/private")
    @SendToUser("/queue/messages")
    public ChatForm sendPrivateMessage(ChatForm msg, Principal principal) {
        template.convertAndSendToUser(
                msg.getTo(),                // 받는 사용자 ID
                "/queue/messages",          // 구독 경로
                msg                         // 메시지 payload
        );
        return msg;
    }


   /* @MessageMapping("/chat/send")
    @SendTo("/topic/public")
    public void ChatMessage broadcast(ChatMessage msg) {
        // 받은 메시지를 그대로 /topic/public 구독자 모두에게 전송
        return msg;
    }*/

    @MessageMapping("/chat/enter")
    public void enter(ChatForm message) {
        message.setMessage(message.getFrom() + "님이 입장했습니다.");
        message.setType(ChatForm.MessageType.ENTER);
        System.out.println("채팅이 연결되었습니다");
        System.out.println("message = " + message);
        template.convertAndSend("/topic/chat/" + message.getRoomId(), message);
    }

    @MessageMapping("/chat/leave")
    public void leave(ChatForm message) {
        message.setMessage(message.getFrom() + "님이 퇴장했습니다.");
        message.setType(ChatForm.MessageType.LEAVE);
        System.out.println("채팅이 연결해제되었습니다");
        System.out.println("message = " + message);
        template.convertAndSend("/topic/chat/" + message.getRoomId(), message);
    }
}
