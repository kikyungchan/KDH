package com.example.backend.product.dto.order;

import lombok.Data;

@Data
public class GuestOrderDetailDto {
    private String guestOrderToken;
    private String guestName;
    private String guestPhone;

}
