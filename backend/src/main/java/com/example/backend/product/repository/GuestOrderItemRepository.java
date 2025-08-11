package com.example.backend.product.repository;

import com.example.backend.product.entity.GuestOrderItem;
import com.example.backend.product.entity.ProductOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestOrderItemRepository extends JpaRepository<GuestOrderItem, Integer> {
    void deleteByOption(ProductOption option);
}