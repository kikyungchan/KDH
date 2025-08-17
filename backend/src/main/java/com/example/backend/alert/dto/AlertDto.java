package com.example.backend.alert.dto;

import com.example.backend.member.dto.MemberDto;
import com.example.backend.member.entity.Member;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link com.example.backend.alert.entity.Alert}
 */
@Value
public class AlertDto implements Serializable {
    Integer id;
    MemberDto user;
    String title;
    String content;
    String status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Member requester;
}