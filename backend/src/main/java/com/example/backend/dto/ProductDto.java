package com.example.backend.dto;

import lombok.Data;

@Data
public class ProductDto {
    private Long id;
    private String productName;
    private Integer price;
    private String imagePath;


}
