package com.example.backend.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class MemberDeleteForm {

    private Integer id;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Pattern(
            regexp = "^[A-Za-z0-9]{8,20}$",
            message = "비밀번호는 영문자와 숫자 조합의 8~20자여야 합니다."
    )
    private String oldPassword;
}
