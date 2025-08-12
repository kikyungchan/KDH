package com.example.backend.chat.dto;

import com.example.backend.member.dto.MemberDto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatListDto {
    Integer id;
    String user;
    String message;
}
