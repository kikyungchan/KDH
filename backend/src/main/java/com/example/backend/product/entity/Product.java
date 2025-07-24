package com.example.backend.product.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String productName;
    private Integer price;
    private String category;
    private String info;
    private Integer quantity;

    @Column(insertable = false, updatable = false)
    private LocalDateTime insertedAt;


    //    casade = 상품저장시 모든 옵션도 같이 저장
//    orphanRemoval= 상품 삭제시 옵션도 함께 삭제
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

}
