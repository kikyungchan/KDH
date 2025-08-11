package com.example.backend.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class GuestOrderRequestDto {
    private String guestName;

    @NotBlank(message = "전화번호는 필수입니다.")
    @Pattern(
            regexp = "^01[016789][0-9]{7,8}$",
            message = "전화번호는 010, 011, 016~019로 시작하는 숫자 형식이어야 합니다."
    )
    private String guestPhone;

    private String receiverName;

    @NotBlank(message = "전화번호는 필수입니다.")
    @Pattern(
            regexp = "^01[016789][0-9]{7,8}$",
            message = "전화번호는 010, 011, 016~019로 시작하는 숫자 형식이어야 합니다."
    )
    private String receiverPhone;
    private String shippingAddress;
    private String addressDetail;
    private String zipcode;

    private Integer productId;
    private String productName;
    private Integer optionId;
    private String optionName;

    private Integer quantity;
    private Integer price;
    private Integer totalPrice;
    private String memo;

}
