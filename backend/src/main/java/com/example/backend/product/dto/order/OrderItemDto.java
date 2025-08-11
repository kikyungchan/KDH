package com.example.backend.product.dto.order;

import com.example.backend.product.entity.OrderItem;

import lombok.Data;

@Data
public class OrderItemDto {
    private Integer productId;

    private String productName;

    private Integer quantity;

    private String productOption;

    private Integer price;

    private String thumbnailUrl;

    // 생성자
    public OrderItemDto(OrderItem item) {
        this.productId = item.getProduct().getId();
        this.productName = item.getProduct().getProductName();
        this.productOption = item.getOption() != null
                ? item.getOption().getOptionName()
                : "기본"; // 옵션이 없을 경우 대비
        this.quantity = item.getQuantity();
        this.price = item.getPrice();
        this.thumbnailUrl = item.getProduct().getThumbnails().isEmpty()
                ? null
                : item.getProduct().getThumbnails().get(0).getStoredPath();
    }


}
