package com.example.backend.product.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {

    private Integer orderId;

    private String orderToken;

    private LocalDateTime orderDate;

    private String memberName;

    private Integer totalPrice;

    private String imageUrl;

    private String status;

    private List<OrderItemDto> orderItems;
}
