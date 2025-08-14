package com.example.backend.product.dto.order;

import com.example.backend.product.entity.GuestOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GuestOrderDetailDto {
    private String guestOrderToken;
    private String guestName;
    private String guestPhone;

    private LocalDateTime orderDate;


    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String receiverAddressDetail;
    private String receiverZipcode;
    private String memo;

    private Integer shippingFee;
    private Integer itemSubtotal;
    private Integer totalPrice;

    private List<OrderItemDto> orderItems;


    public static GuestOrderDetailDto fromEntity(GuestOrder guestOrder) {
        return new GuestOrderDetailDto(
                guestOrder.getGuestOrderToken(),
                guestOrder.getGuestName(),
                guestOrder.getGuestPhone(),
                guestOrder.getOrderDate(),
                guestOrder.getReceiverName(),
                guestOrder.getReceiverPhone(),
                guestOrder.getReceiverAddress(),
                guestOrder.getReceiverAddressDetail(),
                guestOrder.getReceiverZipcode(),
                guestOrder.getMemo(),
                guestOrder.getShippingFee(),
                guestOrder.getItemsSubtotal(),
                guestOrder.getTotalPrice(),
                guestOrder.getItems() == null ? List.of() :
                        guestOrder.getItems().stream().map(OrderItemDto::fromEntity).collect(Collectors.toList())

        );
    }
}
