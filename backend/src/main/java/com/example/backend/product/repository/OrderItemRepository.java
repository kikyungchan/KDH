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

    // 회원 최근 1주일 주문 주회(HOT배지)
//    @Query(value = """
//            SELECT SUM(oi.quantity)
//            FROM order_item oi
//            JOIN orders o ON oi.order_id = o.id
//            WHERE oi.product_id = :productId
//              AND o.created_at > :since
//            """, nativeQuery = true)
//    Integer getWeeklySales(@Param("productId") Integer productId,
//                           @Param("since") LocalDateTime since);

    @Query("SELECT SUM(oi.quantity) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.createdAt > :since " +
           "AND oi.product.id = :productId")
    Integer getWeeklySales(@Param("productId") Integer productId,
                           @Param("since") LocalDateTime since);

}