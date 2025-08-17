package com.example.backend.alert.dto;

import com.example.backend.member.dto.MemberDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlertListDto {
    Integer id;
    String title;
    String content;
    String status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Integer requesterId;
    String link;
}
