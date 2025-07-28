package com.example.backend.qna.dto;

import com.example.backend.member.entity.Member;
import com.example.backend.product.entity.Product;
import lombok.Data;


@Data
public class QuestionAddForm {
    private String title;
    private String content;
    private int category;
    private Integer productId;
}
