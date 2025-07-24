package com.example.backend.member.dto;

import lombok.Data;

@Data
public class ChangePasswordForm {
    private Long id;
    private String oldPassword;
    private String newPassword;
}
