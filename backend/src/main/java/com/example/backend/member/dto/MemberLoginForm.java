package com.example.backend.member.dto;

import lombok.Data;

@Data
public class MemberLoginForm {
    private Integer id;
    private String loginId;
    private String password;
}
