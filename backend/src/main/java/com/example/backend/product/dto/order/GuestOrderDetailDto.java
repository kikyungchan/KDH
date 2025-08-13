package com.example.backend.product.dto.order;

import com.example.backend.product.entity.GuestOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GuestOrderDetailDto {
    private String guestOrderToken;
    private String guestName;
    private String guestPhone;

    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String receiverAddressDetail;
    private String receiverZipcode;
    private String memo;

    private Integer shippingFee;
    private Integer itemSubtotal;
    private Integer totalPrice;

    public static GuestOrderDetailDto fromEntity(GuestOrder guestOrder) {
        return new GuestOrderDetailDto(
                guestOrder.getGuestOrderToken(),
                guestOrder.getGuestName(),
                guestOrder.getGuestPhone(),
                guestOrder.getReceiverName(),
                guestOrder.getReceiverPhone(),
                guestOrder.getReceiverAddress(),
                guestOrder.getReceiverAddressDetail(),
                guestOrder.getReceiverZipcode(),
                guestOrder.getMemo(),
                guestOrder.getShippingFee(),
                guestOrder.getItemsSubtotal(),
                guestOrder.getTotalPrice()
        );
    }
}
