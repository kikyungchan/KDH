package com.example.backend.product.dto;

import lombok.Data;

@Data
public class CartItemDto {
    private Integer productId;
    private String optionName;
    private Integer quantity;
}
