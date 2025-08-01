package com.example.backend.product.repository;

import com.example.backend.product.entity.ProductComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductCommentRepository extends JpaRepository<ProductComment, Integer> {
    List<ProductComment> findByProductIdOrderByIdDesc(Integer productId);

    boolean existsByMemberIdAndProductId(Integer memberId, Integer productId);

    List<ProductComment> findByProductId(Integer productId);
}