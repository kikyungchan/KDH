package com.example.backend.email;

import lombok.Getter;

@Getter
public class EmailAuthResponseDto {
    private boolean success;
    private String responseMessage;

    public EmailAuthResponseDto(boolean success, String responseMessage) {
        this.success = success;
        this.responseMessage = responseMessage;
    }
}