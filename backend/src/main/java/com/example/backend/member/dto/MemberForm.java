package com.example.backend.member.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MemberForm {
    private Long id;
    private String loginId;
    private String password;
    private String name;
    private String email;
    private String phone;
    private String address;
    private LocalDate birthday;
}
