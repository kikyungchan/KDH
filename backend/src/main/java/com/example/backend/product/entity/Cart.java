package com.example.backend.product.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //    장바구니 주인Todo: (로그인된 유저 나중에 추가해야함)
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    @ManyToOne
    @JoinColumn(name = "option_id")
    private ProductOption option;

    private Integer quantity;

    @Column(updatable = false, insertable = false)
    private LocalDateTime insertedAt;

}
