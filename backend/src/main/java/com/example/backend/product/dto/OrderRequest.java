package com.example.backend.product.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private Integer productId;
    private String productName;
    private Integer optionId;
    private String optionName;
    private Integer quantity;
    private Integer price;

    private String shippingAddress;
    private String addressDetail;
    private String zipcode;

    private String orderToken;

    // 주문자/수령인 정보 (주문 레벨) - 리스트 요청 시 첫 원소 기준으로 사용
    private String ordererName;
    private String ordererPhone;

    private String receiverName;
    private String receiverPhone;
    private String receiverZipcode;
    private String receiverAddress;
    private String receiverAddressDetail;
    private String memo;

}
