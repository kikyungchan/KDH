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


    public CartResponseDto(Cart cart) {
        this.cartId = cart.getId();
        this.productName = cart.getProduct().getProductName();
        this.quantity = cart.getQuantity();
        this.price = cart.getOption().getPrice();
        this.optionName = cart.getOption().getOptionName();
        this.totalPrice = this.price * this.quantity;

        //썸네일
        List<ProductImage> images = cart.getProduct().getImages();
        this.imagePath = images != null && !images.isEmpty() ? images.get(0).getStoredPath() : null;
    }

}
