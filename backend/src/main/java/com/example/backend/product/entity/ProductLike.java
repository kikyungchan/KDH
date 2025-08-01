package com.example.backend.product.entity;

import com.example.backend.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "product_like", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"member_id", "product_id"})
})
public class ProductLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private Member member;

    @ManyToOne
    private Product product;

    
}
