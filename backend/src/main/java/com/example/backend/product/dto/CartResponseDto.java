package com.example.backend.product.dto;

import com.example.backend.product.entity.Cart;
import com.example.backend.product.entity.ProductImage;
import com.example.backend.product.entity.ProductThumbnail;
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

    private Integer stockQuantity;

    private List<ProductOptionDto> options;


    public CartResponseDto(Cart cart) {
        this.cartId = cart.getId();
        this.productName = cart.getProduct().getProductName();
        this.quantity = cart.getQuantity();
        this.productId = cart.getProduct().getId();
        this.stockQuantity = cart.getProduct().getQuantity();
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

        //  썸네일: ProductThumbnail 중 첫 번째 항목
        List<ProductThumbnail> thumbnails = cart.getProduct().getThumbnails();
        if (thumbnails != null && !thumbnails.isEmpty()) {
            this.imagePath = thumbnails.get(0).getStoredPath();
            System.out.println("[CartResponseDto] " + productName + " 썸네일: " + this.imagePath);
        } else {
            this.imagePath = "/default.jpg";
            System.out.println("[CartResponseDto] " + productName + " 썸네일 없음 → 기본 이미지 세팅");
        }

        //  옵션 목록 설정
        this.options = cart.getProduct().getOptions().stream().map(opt -> {
            ProductOptionDto dto = new ProductOptionDto();
            dto.setId(opt.getId());
            dto.setOptionName(opt.getOptionName());
            dto.setPrice(opt.getPrice());
            return dto;
        }).toList();

    }

}
