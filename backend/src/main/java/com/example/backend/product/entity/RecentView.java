package com.example.backend.product.entity;

import com.example.backend.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "recent_views")
public class RecentView {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private LocalDateTime viewedAt = LocalDateTime.now();
}
