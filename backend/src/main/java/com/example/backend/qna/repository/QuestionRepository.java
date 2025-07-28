package com.example.backend.qna.repository;

import com.example.backend.qna.dto.QuestionListDto;
import com.example.backend.qna.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    @Query(value = """
                        SELECT new com.example.backend.qna.dto.QuestionListDto(
                                    q.id,
                                    q.title,
                                    q.status,
                                    m.name,
                                    q.category,
                                    q.createdAt,
                                    q.updatedAt)
                        FROM Question q JOIN Member m
                                    ON q.user.loginId = m.loginId
                        WHERE q.title LIKE %:keyword%
                           OR q.content LIKE %:keyword%
                        ORDER BY q.id DESC
            """)
    Page<QuestionListDto> findAllBy(String keyword, PageRequest attr1);
}