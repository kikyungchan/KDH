package com.example.backend.faq.dto;

import lombok.Data;

@Data
public class faqAddForm {
    private String question;
    private String answer;
    private int category;

}
