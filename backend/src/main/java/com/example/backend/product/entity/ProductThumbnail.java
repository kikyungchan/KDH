package com.example.backend.product.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "product_thumbnail")
public class ProductThumbnail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String storedPath;
    private String originalFileName;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Boolean isMain; // 대표 썸네일 여부 (선택적으로 하나만 true)
}

