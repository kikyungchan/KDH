package com.example.backend.product.dto.order;

import com.example.backend.product.entity.Order;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDetailDto {

    private String orderToken;
    private LocalDateTime orderDate;

    private String ordererName;
    private String ordererPhone;

    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String receiverAddressDetail;
    private String receiverZipcode;
    private String memo;

    private Integer itemsSubtotal;
    private Integer shippingFee;
    private Integer totalPrice;

    private List<OrderItemDto> orderItems;

    // 생성자
    public OrderDetailDto(Order order, List<OrderItemDto> allItems) {
        this.orderToken = order.getOrderToken();
        this.orderDate = order.getCreatedAt();

        this.ordererName = order.getOrdererName();
        this.ordererPhone = order.getOrdererPhone();

        this.receiverName = order.getReceiverName();
        this.receiverPhone = order.getReceiverPhone();
        this.receiverAddress = order.getReceiverAddress();
        this.receiverAddressDetail = order.getReceiverAddressDetail();
        this.receiverZipcode = order.getReceiverZipcode();
        this.memo = order.getMemo();

        this.itemsSubtotal = order.getItemsSubtotal();
        this.shippingFee = order.getShippingFee();
        this.totalPrice = order.getTotalPrice();

        this.orderItems = allItems;
    }
}
