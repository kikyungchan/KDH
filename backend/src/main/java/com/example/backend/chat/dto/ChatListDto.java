package com.example.backend.chat.dto;

import com.example.backend.member.dto.MemberDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatListDto {
    Integer id;
    String user;
    String message;
}
