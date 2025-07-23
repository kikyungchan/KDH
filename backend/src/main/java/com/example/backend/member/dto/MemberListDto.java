package com.example.backend.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberListDto {

    private Integer id;

    private String loginId;

    private String name;

    private String phone;

    private String email;

}
