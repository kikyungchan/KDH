package com.example.backend.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MemberListDto {

    private Integer id;

    private String loginId;

    private String name;

    private String phone;

    private String email;

    public MemberListDto(Integer id, String loginId, String name, String phone, String email) {
        this.id = id;
        this.loginId = loginId;
        this.name = name;
        this.phone = phone;
        this.email = email;
    }
}
