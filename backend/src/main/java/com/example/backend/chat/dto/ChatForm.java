package com.example.backend.chat.dto;

import lombok.Data;

@Data
public class ChatForm {
    private String from;        // 누가
    private String to;          // 누구한테
    private String message;     // 무엇을
}
