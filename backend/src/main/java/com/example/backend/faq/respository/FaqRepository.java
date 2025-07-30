package com.example.backend.faq.respository;

import com.example.backend.faq.dto.FaqListDto;
import com.example.backend.faq.entity.Faq;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FaqRepository extends JpaRepository<Faq, Integer> {

    @Query(value = """
                        SELECT new com.example.backend.faq.dto.FaqListDto(
                                    q.id,
                                    q.question,
                                    q.answer,
                                    q.category,
                                    q.createdAt,
                                    q.updatedAt)
                        FROM Faq q 
                        WHERE q.question LIKE %:keyword%
                           OR q.answer LIKE %:keyword%
                        ORDER BY q.id DESC
            """)
    Page<FaqListDto> findAllBy(String keyword, PageRequest of);
}