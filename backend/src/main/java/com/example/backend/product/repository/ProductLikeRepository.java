package com.example.backend.product.repository;

import com.example.backend.member.entity.Member;
import com.example.backend.product.entity.Product;
import com.example.backend.product.entity.ProductLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductLikeRepository extends JpaRepository<ProductLike, Integer> {
    boolean existsByMemberAndProduct(Member member, Product product);

    int countByProduct(Product product);

    ProductLike findByMemberAndProduct(Member member, Product product);
}