package com.example.backend.product.dto;

import lombok.Data;

@Data
public class CartUpdateRequest {
    private Long cartId;
    private Long optionId;
    private Integer quantity;
}
