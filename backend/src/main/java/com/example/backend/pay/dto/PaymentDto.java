package com.example.backend.pay.dto;

import com.example.backend.member.dto.MemberDto;
import com.example.backend.member.entity.Member;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

/**
 * DTO for {@link com.example.backend.pay.entity.Payment}
 */
@Value
public class PaymentDto implements Serializable {
    String paymentKey;
    String orderId;
    Integer amount;
    String status;
    String orderName;
    String paymentMethod;
    OffsetDateTime requestedAt;
    OffsetDateTime approvedAt;
    Member userid;
    String transactionKey;
    String receiptUrl;
    String errorCode;
    String errorMessage;
    String mid;
    String version;
    String virtualAccountInfo;
}