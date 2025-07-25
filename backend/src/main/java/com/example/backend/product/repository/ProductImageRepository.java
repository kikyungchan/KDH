package com.example.backend.product.repository;

import com.example.backend.product.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    void deleteByStoredPath(String path);
}