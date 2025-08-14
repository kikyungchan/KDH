package com.example.backend.chat.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatForm {
    private String roomId;             // 채팅방 구분
    private String from;        // 누가
    private String userid;      // 누가(userid)
    private String to;          // 누구한테
    private String message;     // 무엇을
    private MessageType type;          // 메시지 타입 (ENTER, CHAT, LEAVE 등)
    private LocalDateTime CreateAt;      // 전송 시간

    public enum MessageType {
        ENTER, CHAT, LEAVE, END
    }
}


