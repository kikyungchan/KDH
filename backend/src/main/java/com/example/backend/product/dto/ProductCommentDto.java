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
    private String memberLoginId;
    private LocalDateTime createdAt;
    private Integer productId;

    public ProductCommentDto(Integer id, String content, String memberLoginId, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.memberLoginId = memberLoginId;
        this.createdAt = createdAt;
    }
}
