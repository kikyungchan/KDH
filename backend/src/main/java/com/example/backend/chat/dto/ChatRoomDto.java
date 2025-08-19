package com.example.backend.chat.dto;

import com.example.backend.chat.entity.ChatRoom;
import com.example.backend.member.dto.MemberDto;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link ChatRoom}
 */
@Value
public class ChatRoomDto implements Serializable {
    Integer id;
    MemberDto user;
    String roomId;
    String type;
    LocalDateTime createdAt;
}