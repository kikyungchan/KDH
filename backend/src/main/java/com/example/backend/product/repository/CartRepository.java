package com.example.backend.product.repository;

import com.example.backend.product.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByMemberId(Long memberId);
//    List<Cart> findByUser(User user)
}