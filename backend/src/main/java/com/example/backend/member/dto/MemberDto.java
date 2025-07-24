package com.example.backend.member.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MemberDto {
    private Long id;
    private String loginId;
    private String name;
    private LocalDate birthday;
    private String email;
    private String phone;
    private String address;
}
