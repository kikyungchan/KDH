package com.example.backend.email;

import lombok.Getter;

@Getter
public class EmailAuthResponseDto {
    private boolean success;
    private String message;

    public EmailAuthResponseDto(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}