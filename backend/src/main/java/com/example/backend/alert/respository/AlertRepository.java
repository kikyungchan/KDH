package com.example.backend.alert.respository;

import com.example.backend.alert.dto.AlertDto;
import com.example.backend.alert.dto.AlertListDto;
import com.example.backend.alert.entity.Alert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AlertRepository extends JpaRepository<Alert, Integer> {
    @Query(value = """
                        SELECT new com.example.backend.alert.dto.AlertListDto(
                                    a.id,
                                    a.title,
                                    a.content,
                                    a.status,
                                    a.createdAt,
                                    a.updatedAt,
                                    m.name,
                                    a.link)
                        FROM Alert a JOIN Member m
                                    ON a.requester.loginId = m.loginId
                        WHERE (a.title LIKE %:keyword%
                           OR a.content LIKE %:keyword%) 
                           and (a.user.loginId = :userId)
                        ORDER BY a.id DESC
            """)
    Page<AlertListDto> findAllBy(String keyword, String userId, PageRequest of);
}