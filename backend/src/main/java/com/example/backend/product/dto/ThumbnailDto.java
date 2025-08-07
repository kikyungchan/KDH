package com.example.backend.product.dto;

import lombok.Data;

@Data
public class ThumbnailDto {
    private String storedPath;
    private Boolean isMain;
    private Integer productId;
}
