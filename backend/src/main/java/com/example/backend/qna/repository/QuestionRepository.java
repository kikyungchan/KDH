package com.example.backend.qna.repository;

import com.example.backend.qna.dto.QuestionDto;
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


    @Query(value = """
            SELECT new com.example.backend.qna.dto.QuestionDto
            (
                         q.id,
                         p.productName,
                         p.id,
                         m.loginId,
                         q.title,
                         p.price,
                         q.content,
                         q.status,
                         q.createdAt,
                         q.updatedAt,
                         q.category
                    )
                        FROM Question q join Product p
                                    on q.product.id = p.id
                        left join Member m
                                    on q.user.loginId = m.loginId
                        where q.id = :id
            """
    )
    QuestionDto findQuestionById(int id);
}