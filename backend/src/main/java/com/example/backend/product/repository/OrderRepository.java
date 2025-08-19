package com.example.backend.product.repository;

import com.example.backend.product.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    Page<Order> findByMember_Id(Integer memberId, Pageable pageable);

    @Query("SELECT DISTINCT o.orderToken FROM Order o WHERE o.member.id = :memberId ORDER BY o.createdAt DESC")
    List<String> findDistinctOrderTokensByMemberId(@Param("memberId") Integer memberId);


    List<Order> findAllByOrderToken(String orderToken);

    boolean existsByOrderToken(String orderToken);

    List<Order> findAllByOrderTokenAndMemberId(String orderToken, Integer memberId);
}
