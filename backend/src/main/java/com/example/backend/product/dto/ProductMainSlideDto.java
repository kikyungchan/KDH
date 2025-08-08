package com.example.backend.product.dto;

import com.example.backend.product.entity.Product;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
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

    public ProductMainSlideDto(Integer id, String productName, Integer price, String thumbnailUrl) {
        this.id = id;
        this.productName = productName;
        this.price = price;
        this.thumbnailUrl = thumbnailUrl;
    }
}
