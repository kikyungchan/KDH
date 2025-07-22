package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String storedPath;
    private String originalFileName;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
