package com.example.backend.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ProductCommentDto {
    private Integer id;
    private String content;
    private String memberName;
    private LocalDateTime createdAt;
    private Integer productId;

    public ProductCommentDto(Integer id, String content, String memberName, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.memberName = memberName;
        this.createdAt = createdAt;
    }
}
