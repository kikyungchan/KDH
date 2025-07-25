package com.example.backend.product.repository;

import com.example.backend.product.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
//    List<Cart> findByUser(User user)
}