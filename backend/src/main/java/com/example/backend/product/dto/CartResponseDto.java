package com.example.backend.product.dto;

import com.example.backend.product.entity.Cart;
import com.example.backend.product.entity.ProductImage;
import lombok.Data;

import java.util.List;

@Data
public class CartResponseDto {
    private Integer cartId;
    private String imagePath;
    private String productName;
    private String optionName;
    private Integer quantity;
    private Integer price;
    private Integer totalPrice;
    private Integer productId;
    private Integer optionId;

    private List<ProductOptionDto> options;


    public CartResponseDto(Cart cart) {
        this.cartId = cart.getId();
        this.productName = cart.getProduct().getProductName();
        this.quantity = cart.getQuantity();
        this.productId = cart.getProduct().getId();
        // 옵션이 있는 경우
        if (cart.getOption() != null) {
            this.price = cart.getOption().getPrice();
            this.optionName = cart.getOption().getOptionName();
            this.optionId = cart.getOption().getId();
        } else {
            // 단일 상품인경우
            this.price = cart.getProduct().getPrice();
            this.optionName = null;
            this.optionId = null;
        }

        this.totalPrice = this.price * this.quantity;

        //썸네일
        List<ProductImage> images = cart.getProduct().getImages();
        this.imagePath = images != null && !images.isEmpty() ? images.get(0).getStoredPath() : null;

        // ✅ 옵션 목록 설정
        this.options = cart.getProduct().getOptions().stream().map(opt -> {
            ProductOptionDto dto = new ProductOptionDto();
            dto.setId(opt.getId());
            dto.setOptionName(opt.getOptionName());
            dto.setPrice(opt.getPrice());
            return dto;
        }).toList();

    }

}
