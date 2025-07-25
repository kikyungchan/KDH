package com.example.backend.product.dto;

import lombok.Data;

@Data
public class CartDeleteRequest {
    private Long productId;
    private Long optionId;
}
