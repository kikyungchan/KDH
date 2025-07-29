package com.example.backend.product.dto;

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


    private List<ProductOptionDto> options;
    private List<String> imagePath;


}
