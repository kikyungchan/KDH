package com.example.backend.product.dto;

import lombok.Data;

@Data
public class CartUpdateRequest {
    private Integer cartId;
    private Integer optionId;
    private Integer quantity;
}
