package com.example.backend.member.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MemberForm {
    private Integer id;

    @NotBlank(message = "아이디는 필수입니다.")
    @Pattern(
//            TODO : admin 을 포함한 id 는 생성불가
            regexp = "^[A-Za-z][A-Za-z0-9]{3,19}$",
            message = "아이디는 영문으로 시작하고 4~20자의 영문자 또는 숫자여야 합니다."
    )
    private String loginId;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Pattern(
            regexp = "^[A-Za-z0-9]{8,20}$",
            message = "비밀번호는 영문자와 숫자 조합의 8~20자여야 합니다."
    )
    private String password;

    @NotBlank(message = "이름은 필수입니다.")
    @Pattern(
            regexp = "^[가-힣a-zA-Z\\s]{2,20}$",
            message = "이름은 한글 또는 영문 2~20자여야 합니다."
    )
    private String name;

    @NotBlank(message = "이메일은 필수입니다.")
    @Pattern(
            regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
            message = "유효한 이메일 형식이어야 합니다."
    )
    private String email;

    @NotBlank(message = "전화번호는 필수입니다.")
    @Pattern(
            regexp = "^01[016789][0-9]{7,8}$",
            message = "전화번호는 010, 011, 016~019로 시작하는 숫자 형식이어야 합니다."
    )
    private String phone;

    @NotBlank(message = "주소는 필수입니다.")
    private String address;

    @NotBlank(message = "우편번호는 필수입니다.")
    private String zipCode;

    private String addressDetail;

    @NotNull(message = "생년월일은 필수입니다.")
    @Past(message = "생년월일은 과거 날짜여야 합니다.")
    private LocalDate birthday;

    @NotNull(message = "개인정보 수집 및 이용에 동의하지 않으실경우, 서비스 이용이 어렵습니다.")
    private Boolean privacyAgreed;

}
