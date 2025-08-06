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


    private List<ProductOptionDto> options;
}
