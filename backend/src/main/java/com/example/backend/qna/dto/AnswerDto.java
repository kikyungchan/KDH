package com.example.backend.qna.dto;

import com.example.backend.member.dto.MemberDto;
import com.example.backend.qna.entity.Answer;
import com.example.backend.qna.entity.Question;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link Answer}
 */
@Value
public class AnswerDto implements Serializable {
    Integer id;
    Question question;
    MemberDto seller;
    String content;
    Instant createdAt;
    Instant updatedAt;
}