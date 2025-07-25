package com.example.backend.qna.dto;

import com.example.backend.product.dto.ProductDto;
import com.example.backend.member.dto.MemberDto;
import com.example.backend.qna.entity.Question;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link Question}
 */
@Value
public class QuestionDto implements Serializable {
    Integer id;
    ProductDto product;
    MemberDto user;
    String title;
    String content;
    String status;
    Instant createdAt;
    Instant updatedAt;
    String category;

}