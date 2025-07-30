package com.example.backend.qna.dto;

import com.example.backend.qna.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link Question}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDto implements Serializable {
    private Integer id;
    private String product;
    private Integer productId;
    private String user;
    private String title;
    private Integer price;
    private String content;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer category;

    private String imagePath;

    public QuestionDto(Integer id,
                       String product,
                       Integer productId,
                       String user,
                       String title,
                       Integer price,
                       String content,
                       String status,
                       LocalDateTime createdAt,
                       LocalDateTime updatedAt,
                       Integer category) {
        this.id = id;
        this.product = product;
        this.productId = productId;
        this.user = user;
        this.title = title;
        this.price = price;
        this.content = content;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.category = category;
    }

}