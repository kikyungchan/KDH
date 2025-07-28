package com.example.backend.product.dto;

import com.example.backend.product.entity.Cart;
import com.example.backend.product.entity.ProductImage;
import lombok.Data;

import java.util.List;

@Data
public class CartResponseDto {
    private Long cartId;
    private String imagePath;
    private String productName;
    private String optionName;
    private Integer quantity;
    private Integer price;
    private Integer totalPrice;
    private Long productId;
    private Long optionId;

    private List<ProductOptionDto> options;


    public CartResponseDto(Cart cart) {
        this.cartId = cart.getId();
        this.productName = cart.getProduct().getProductName();
        this.quantity = cart.getQuantity();
        this.price = cart.getOption().getPrice();
        this.optionName = cart.getOption().getOptionName();
        this.totalPrice = this.price * this.quantity;
        this.productId = Long.valueOf(cart.getProduct().getId());
        this.optionId = cart.getOption().getId();

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
