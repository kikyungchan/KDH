package com.example.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductEditDto {
    private String productName;
    private Integer price;
    private String category;
    private String info;
    private Integer quantity;

    private List<String> deletedImages;
}
