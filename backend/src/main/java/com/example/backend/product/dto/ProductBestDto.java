package com.example.backend.product.dto;

import com.example.backend.product.entity.Product;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProductBestDto {
    private Integer id;
    private String productName;
    private Integer price;
    private String thumbnailUrl;
    private Double averageRating;
    private Integer reviewCount;
    private String category;
    private List<String> thumbnailPaths = new ArrayList<>();

    public static ProductBestDto from(Product product, Double avgRating, Integer reviewCnt) {
        ProductBestDto dto = new ProductBestDto();
        dto.setId(product.getId());
        dto.setProductName(product.getProductName());
        dto.setPrice(product.getPrice());
        // 추천상품 썸네일
        if (product.getThumbnails() != null && !product.getThumbnails().isEmpty()) {
            for (var thumb : product.getThumbnails()) {
                dto.getThumbnailPaths().add(thumb.getStoredPath());
            }
        }
        // 베스트상품
        String thumbnailUrl = "/default.jpg";
        if (product.getThumbnails() != null) {
            for (var thumb : product.getThumbnails()) {
                if (Boolean.TRUE.equals(thumb.getIsMain())) {
                    thumbnailUrl = thumb.getStoredPath();
                    break;
                }
            }
        }
        dto.setThumbnailUrl(thumbnailUrl);

        dto.setAverageRating(avgRating);
        dto.setReviewCount(reviewCnt);
        return dto;
    }


}
