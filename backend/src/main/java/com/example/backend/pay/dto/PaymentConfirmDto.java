package com.example.backend.pay.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PaymentConfirmDto {
    private String paymentKey;
    private String orderId;
    private Long amount; //가격은 정수로
}
