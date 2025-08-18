package com.example.backend.chat.repository;

import com.example.backend.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {
    ChatRoom findByRoomId(String roomId);
}