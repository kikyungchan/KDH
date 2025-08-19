package com.example.backend.product.repository;

import com.example.backend.product.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    @Query("""
                SELECT COUNT(oi) > 0
                FROM OrderItem oi
                WHERE oi.product.id = :productId
                  AND oi.order.member.id = :memberId
            """)
    boolean existsByMemberIdAndProductId(@Param("memberId") Integer memberId,
                                         @Param("productId") Integer productId);

    // 특정상품의 회원주문 기준 최근기간 이후 판매량 합계
    @Query("SELECT SUM(oi.quantity) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.createdAt > :since " +
           "AND oi.product.id = :productId")
    Integer getWeeklySales(@Param("productId") Integer productId,
                           @Param("since") LocalDateTime since);

}