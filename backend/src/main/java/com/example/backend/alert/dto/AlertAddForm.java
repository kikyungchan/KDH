package com.example.backend.alert.dto;

import com.example.backend.member.dto.MemberDto;
import lombok.Data;

@Data
public class AlertAddForm {
    String user;
    String title;
    String content;
    String link;
}
