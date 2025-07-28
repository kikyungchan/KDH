package com.example.backend.product.repository;

import com.example.backend.product.entity.GuestOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestOrderRepository extends JpaRepository<GuestOrder, Integer> {
}