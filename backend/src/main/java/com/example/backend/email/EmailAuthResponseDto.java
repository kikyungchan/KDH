package com.example.backend.email;

import lombok.Getter;

@Getter
public class EmailAuthResponseDto {
    private boolean success;
    private String message;
    private long remainTimeInSec;

    public EmailAuthResponseDto(boolean success, String message, long remainTimeInSec) {
        this.success = success;
        this.message = message;
        this.remainTimeInSec = remainTimeInSec;
    }
}