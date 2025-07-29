package com.example.backend.qna.repository;

import com.example.backend.qna.entity.Answer;
import com.example.backend.qna.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Integer> {
    Answer findByQuestionId(Integer questionId);

    void deleteByQuestion(Question question);
}