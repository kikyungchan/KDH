package com.example.backend.product.repository;

import com.example.backend.product.dto.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    @Query("""
                SELECT COUNT(oi) > 0
                FROM OrderItem oi
                WHERE oi.product.id = :productId
                  AND oi.order.member.id = :memberId
            """)
    boolean existsByMemberIdAndProductId(@Param("memberId") Integer memberId,
                                         @Param("productId") Integer productId);
}