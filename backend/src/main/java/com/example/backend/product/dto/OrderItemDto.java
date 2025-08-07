package com.example.backend.product.dto;

import com.example.backend.product.entity.OrderItem;

import lombok.Data;

@Data
public class OrderItemDto {
    private String productName;

    private Integer quantity;

    private String productOption;

    private Integer price;

    // ✅ 생성자 추가!
    public OrderItemDto(OrderItem item) {
        this.productName = item.getProduct().getName();
        this.productOption = item.getOption();
        this.quantity = item.getQuantity();
        this.price = item.getPrice();
    }


}
