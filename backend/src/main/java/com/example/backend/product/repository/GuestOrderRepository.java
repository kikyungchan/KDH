package com.example.backend.product.repository;

import com.example.backend.product.entity.GuestOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface GuestOrderRepository extends JpaRepository<GuestOrder, Integer> {

    @Query(value = """
            SELECT SUM(quantity)
            FROM guest_orders
            WHERE product_id = :productId
              AND created_at > :since
            """, nativeQuery = true)
    Integer getWeeklySales(@Param("productId") Integer productId, @Param("since") LocalDateTime since);
}