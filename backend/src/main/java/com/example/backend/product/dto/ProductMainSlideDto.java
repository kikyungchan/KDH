package com.example.backend.product.dto;

import com.example.backend.product.entity.Product;
import lombok.Data;

@Data
public class ProductMainSlideDto {
    private Integer id;
    private String productName;
    private Integer price;
    private String thumbnailUrl;

    public static ProductMainSlideDto from(Product product) {
        ProductMainSlideDto dto = new ProductMainSlideDto();
        dto.setId(product.getId());
        dto.setProductName(product.getProductName());
        dto.setPrice(product.getPrice());
        if (!product.getImages().isEmpty()) {
            dto.setThumbnailUrl(product.getImages().get(0).getStoredPath());
        } else {
            dto.setThumbnailUrl("/default.jpg");
        }
        return dto;
    }
}
