package com.example.backend.product.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ProductEditDto {
    private String productName;
    private Integer price;
    private String category;
    private String info;
    private Integer quantity;
    private List<ProductOptionDto> options;

    private List<MultipartFile> newImages;
    private List<String> deletedImages;

    private List<String> deletedThumbnails;
    private List<MultipartFile> newThumbnails;
}
