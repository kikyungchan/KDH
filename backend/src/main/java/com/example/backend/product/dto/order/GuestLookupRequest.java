package com.example.backend.product.dto.order;

import lombok.Data;

@Data
public class GuestLookupRequest {

    private String guestOrderToken;

    private String guestName;

    private String guestPhone;

}
