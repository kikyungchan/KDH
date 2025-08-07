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
        this.productName = item.getProduct().getProductName();
        this.productOption = item.getOption() != null
                ? item.getOption().getOptionName()
                : "기본"; // 옵션이 없을 경우 대비
        this.quantity = item.getQuantity();
        this.price = item.getPrice();
    }


}
