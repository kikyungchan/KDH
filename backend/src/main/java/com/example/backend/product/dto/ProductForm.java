package com.example.backend.product.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ProductForm {

    private String productName;
    private Integer price;
    private String category;
    private String info;
    private Integer quantity;
    private String detailText;
    private List<ProductOptionDto> options;
    private List<MultipartFile> images;
}
