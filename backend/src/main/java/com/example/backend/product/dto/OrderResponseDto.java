package com.example.backend.product.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDto {
    private LocalDateTime orderDate;

    private String orderToken;

    private Integer totalPrice;

    private List<OrderItemDto> orderItems;
}
