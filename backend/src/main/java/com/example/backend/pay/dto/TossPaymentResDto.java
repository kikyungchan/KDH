package com.example.backend.pay.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
// 알 수 없는 필드 발견하면 무시하고 지나가기
@JsonIgnoreProperties(ignoreUnknown = true)
public class TossPaymentResDto {
    // 토스페이먼츠 API 응답 문서(https://docs.tosspayments.com/reference#payment-%EA%B0%9D%EC%B2%B4) 참고
    private String mId; // 상점 아이디
    private String version;
    private String paymentKey;
    private String status; // 결제 상태 (DONE, CANCELED 등)
    private String lastTransactionKey;
    private String method; // 결제 수단 (카드, 가상계좌 등)
    private String orderId;
    private String orderName;
    private String requestedAt; // 요청 시각
    private String approvedAt; // 승인 시각
    private Boolean useEscrow;
    private Boolean cultureExpense;
    private Object virtualAccount; //가상게좌 여부
    private String code; // 에러 코드 필드 (옵션)
    private String message; // 에러 메시지 필드 (옵션)

    private Long totalAmount; // 총 결제 금액

    public TossPaymentResDto(String status, String message, String code) {
        this.status = status; // 'FAILED' 같은 값
        this.message = message; // 오류 메시지
        this.code = code; // null 또는 에러 코드
    }

}
