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
    private String userid;
    private String title;
    private Integer price;
    private String content;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer category;

    private String imagePath;
    private String answer;

    public QuestionDto(Integer id,
                       String product,
                       Integer productId,
                       String userid,
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
        this.userid = userid;
        this.title = title;
        this.price = price;
        this.content = content;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.category = category;
    }

}