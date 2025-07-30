package com.example.backend.faq.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link com.example.backend.faq.entity.Faq}
 */
@Value
@Data
@Getter
@Setter
public class FaqDto implements Serializable {
    Integer id;
    String question;
    String answer;
    Integer category;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}