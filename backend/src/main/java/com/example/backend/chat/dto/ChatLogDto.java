package com.example.backend.chat.dto;

import com.example.backend.member.dto.MemberDto;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link com.example.backend.chat.entity.ChatLog}
 */
@Value
public class ChatLogDto implements Serializable {
    Integer id;
    MemberDto user;
    String roomId;
    String message;
    String type;
    LocalDateTime createdAt;
}