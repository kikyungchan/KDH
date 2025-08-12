package com.example.backend.product.dto.order;

import com.example.backend.product.entity.Order;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDetailDto {

    private String orderToken;
    private LocalDateTime orderDate;
    private String memberName;
    private String phone;

    private Integer totalPrice;

    private String shippingAddress;
    private String zipcode;
    private String addressDetail;


    private String memo;

    private List<OrderItemDto> orderItems;

    // 생성자
    public OrderDetailDto(Order order, List<OrderItemDto> allItems) {
        this.orderToken = order.getOrderToken();
        this.orderDate = order.getCreatedAt();
        this.memberName = order.getMember().getName();
        this.phone = order.getMember().getPhone();
        this.totalPrice = allItems.stream()
                .mapToInt(item -> item.getPrice() * item.getQuantity())
                .sum();

        this.shippingAddress = order.getReceiverAddress();
        this.zipcode = order.getReceiverZipcode();
        this.addressDetail = order.getReceiverAddressDetail();
        this.memo = order.getMemo();

        this.orderItems = allItems;
    }
}
