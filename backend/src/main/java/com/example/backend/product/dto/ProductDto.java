package com.example.backend.product.dto;

import com.example.backend.product.entity.Product;
import com.example.backend.product.entity.ProductImage;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductDto {
    private Integer id;
    private String productName;
    private Integer price;
    private String category;
    private String info;
    private Integer quantity;
    private LocalDateTime insertedAt;
    private String detailText;
    private boolean hot;
    private List<ThumbnailDto> thumbnailPaths;
    private List<String> detailImagePaths;
    private String thumbnail;

    private List<ProductOptionDto> options;

    // 정적 팩토리 메서드
    public static ProductDto fromEntity(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setProductName(product.getProductName());
        dto.setPrice(product.getPrice());
        // 썸네일 하나만 대표로
        if (product.getThumbnails() != null && !product.getThumbnails().isEmpty()) {
            dto.setThumbnail(product.getThumbnails().get(0).getStoredPath());
        }
        return dto;
    }
}
