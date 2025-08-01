package com.example.backend.email;

import lombok.Data;

@Data
public class EmailAuthVerifyRequestDto {
    private String address;
    private String authCode;
}
