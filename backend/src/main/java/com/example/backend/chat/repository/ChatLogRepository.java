package com.example.backend.chat.repository;

import com.example.backend.chat.dto.ChatListDto;
import com.example.backend.chat.entity.ChatLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ChatLogRepository extends JpaRepository<ChatLog, Integer> {
    @Query(value = """
                        SELECT new com.example.backend.chat.dto.ChatListDto(
                                    c.id,
                                    c.user.name,
                                    c.message)
                        FROM ChatLog c JOIN Member m
                                    ON c.user.loginId = m.loginId
                        WHERE (c.roomId = :roomId)
                        ORDER BY c.id DESC
            """)
    Page<ChatListDto> findAllBy(String roomId, PageRequest of);
}