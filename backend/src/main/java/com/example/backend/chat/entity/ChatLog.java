package com.example.backend.chat.entity;

import com.example.backend.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Entity
@Table(name = "chat_log", schema = "prj4")
public class ChatLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, referencedColumnName = "login_id")
    private Member user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "room_id", nullable = false, referencedColumnName = "room_id")
    private ChatRoom roomId;

    @Column(name = "message")
    private String message;

    @Lob
    @Column(name = "type")
    private String type;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at", insertable = false)
    private LocalDateTime createdAt;

}