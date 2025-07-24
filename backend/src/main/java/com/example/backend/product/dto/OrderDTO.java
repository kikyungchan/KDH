package com.example.backend.product.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderDTO {
    private Long productId;
    private Long orderId;
    private String productName;
    private Integer price;
    private Integer quantity;
    private Integer totalPrice;
    private LocalDateTime orderDate;
}
