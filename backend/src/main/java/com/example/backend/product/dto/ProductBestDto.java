package com.example.backend.product.dto;

import com.example.backend.product.entity.Product;
import lombok.Data;

@Data
public class ProductBestDto {
    private Integer id;
    private String productName;
    private Integer price;
    private String thumbnailUrl;
    private Double averageRating;
    private Integer reviewCount;

    public static ProductBestDto from(Product product, Double avgRating, Integer reviewCnt) {
        ProductBestDto dto = new ProductBestDto();
        dto.setId(product.getId());
        dto.setProductName(product.getProductName());
        dto.setPrice(product.getPrice());
        dto.setThumbnailUrl(
                product.getImages().isEmpty() ? "/default.jpg" : product.getImages().get(0).getStoredPath()
        );
        dto.setAverageRating(avgRating);
        dto.setReviewCount(reviewCnt);
        return dto;
    }
}
