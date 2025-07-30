package com.example.backend.qna.dto;

import lombok.Data;

@Data
public class AnswerAddForm {
    private Integer questionId;
    private String seller;
    private String answer;
}
