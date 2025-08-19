package com.example.backend.product.repository;

import com.example.backend.product.entity.GuestOrder;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface GuestOrderRepository extends JpaRepository<GuestOrder, Integer> {
    // 최근기간(7일) 이후 판매량 합산
    @Query(value = """
            SELECT SUM(goi.quantity)
            FROM guest_order_item goi
            JOIN guest_orders go ON goi.guest_order_id = go.id
            WHERE goi.product_id = :productId
              AND go.created_at > :since
            """, nativeQuery = true)
    Integer getWeeklySales(@Param("productId") Integer productId, @Param("since") LocalDateTime since);

    @Query("""
                select o
                from GuestOrder o
                where o.guestOrderToken = :token
            """)
    Optional<GuestOrder> findVerifyByToken(@Param("token") String token);


    @Query("""
              select distinct o
              from GuestOrder o
                join fetch o.items oi
                join fetch oi.product p
              where o.guestOrderToken = :token
            """)
    Optional<GuestOrder> findDetailByToken(@Param("token") String token);
}