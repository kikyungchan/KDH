package com.example.backend.product.dto;

import lombok.Data;

@Data
public class OrderItemDto {
    private String productName;

    private Integer quantity;

    private String productOption;

    private Integer price;
}
