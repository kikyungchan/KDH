package com.example.backend.product.repository;

import com.example.backend.product.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    Page<Order> findByMember_LoginId(String loginId, Pageable pageable);
}
