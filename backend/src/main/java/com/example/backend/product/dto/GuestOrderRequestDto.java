package com.example.backend.product.dto;

import lombok.Data;

@Data
public class GuestOrderRequestDto {
    private String guestName;
    private String guestPhone;

    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private String addressDetail;
    private String zipcode;

    private Integer productId;
    private String productName;
    private Integer optionId;
    private String optionName;

    private Integer quantity;
    private Integer price;
    private Integer totalPrice;
    private String memo;

}
