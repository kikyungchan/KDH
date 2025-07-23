package com.example.backend.member.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

@Data
public class MemberForm {
    private Long id;

    @NotBlank(message = "아이디는 필수입니다.")
    @Pattern(
            regexp = "^[A-Za-z][A-Za-z0-9]{3,19}$",
            message = "아이디는 영문으로 시작하고 4~20자의 영문자 또는 숫자여야 합니다."
    )
    private String loginId;


    private String password;
    private String name;
    private String email;
    private String phone;
    private String address;
    private LocalDate birthday;
}
