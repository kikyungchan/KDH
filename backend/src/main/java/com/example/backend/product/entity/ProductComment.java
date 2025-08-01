package com.example.backend.product.entity;

import com.example.backend.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "product_comment")
public class ProductComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 어떤 상품에 대한 리뷰인지
    @ManyToOne
    private Product product;

    // 누가 작성했는지
    @ManyToOne
    private Member member;

    // 리뷰 내용
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // 작성 시각
    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // 별점
    @Column(nullable = false)
    private Integer rating;
}
