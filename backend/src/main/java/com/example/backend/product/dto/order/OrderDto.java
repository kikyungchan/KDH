package com.example.backend.product.dto.order;

import com.example.backend.product.entity.Order;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class OrderDto {

    private Integer orderId;

    private String orderToken;

    private LocalDateTime orderDate;

    private String memberName;

    private Integer itemsSubtotal;

    private Integer shippingFee;

    private Integer totalPrice;

    private String imageUrl;

    private String status;

    private List<OrderItemDto> orderItems;

    public OrderDto(Order order) {
        this.orderId = order.getId();
        this.orderToken = order.getOrderToken();
        this.orderDate = order.getCreatedAt();
        this.memberName = order.getMember().getName();
        this.orderItems = order.getOrderItems().stream()
                .map(OrderItemDto::new)
                .collect(Collectors.toList());

        this.itemsSubtotal = order.getItemsSubtotal();
        this.shippingFee = order.getShippingFee();
        this.totalPrice = order.getTotalPrice();


        this.imageUrl = order.getOrderItems().isEmpty()
                ? null
                : order.getOrderItems().get(0).getProduct().getThumbnails().isEmpty()
                ? null
                : order.getOrderItems().get(0).getProduct().getThumbnails().get(0).getStoredPath();
    }
}
