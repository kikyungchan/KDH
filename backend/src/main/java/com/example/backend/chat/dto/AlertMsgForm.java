package com.example.backend.chat.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AlertMsgForm {
    private String from;        // 누가
    private String to;          // 누구한테
    private String title;          // 제목
    private String content;          // 내용
    private String link;
    private LocalDateTime CreateAt;      // 전송 시간
}
