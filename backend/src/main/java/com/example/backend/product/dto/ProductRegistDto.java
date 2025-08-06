package com.example.backend.product.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ProductRegistDto {
    private Integer id;
    private String productName;
    private Integer price;
    private String category;
    private String info;
    private Integer quantity;
    private String detailText;

    // 옵션
    private List<ProductOptionDto> options;

    // 썸네일
    private List<MultipartFile> thumbnails;

    // 본문 이미지들
    private List<MultipartFile> detailImages;

}
