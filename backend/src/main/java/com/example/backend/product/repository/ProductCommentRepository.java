package com.example.backend.product.repository;

import com.example.backend.product.entity.ProductComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductCommentRepository extends JpaRepository<ProductComment, Integer> {
    List<ProductComment> findByProductIdOrderByIdDesc(Integer productId);

    boolean existsByMemberIdAndProductId(Integer memberId, Integer productId);

    List<ProductComment> findByProductId(Integer productId);

    //평균별점
    @Query("SELECT AVG(c.rating) FROM ProductComment c WHERE c.product.id = :productId")
    Double getAverageRating(@Param("productId") Integer productId);

    // 댓글수
    @Query("SELECT COUNT(c) FROM ProductComment c WHERE c.product.id = :productId")
    Integer getReviewCount(@Param("productId") Integer productId);
}