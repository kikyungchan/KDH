package com.example.backend.product.repository;

import com.example.backend.product.entity.GuestOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface GuestOrderRepository extends JpaRepository<GuestOrder, Integer> {

    @Query(value = """
            SELECT SUM(goi.quantity)
            FROM guest_order_item goi
            JOIN guest_orders go ON goi.guest_order_id = go.id
            WHERE goi.product_id = :productId
              AND go.created_at > :since
            """, nativeQuery = true)
    Integer getWeeklySales(@Param("productId") Integer productId, @Param("since") LocalDateTime since);


    Optional<GuestOrder> findByGuestOrderToken(String guestOrderToken);
}