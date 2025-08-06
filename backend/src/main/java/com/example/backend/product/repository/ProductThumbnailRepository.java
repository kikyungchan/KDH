package com.example.backend.product.repository;

import com.example.backend.product.entity.ProductThumbnail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductThumbnailRepository extends JpaRepository<ProductThumbnail, Integer> {
    void deleteByStoredPath(String storedPath);

    //좌측배너
    List<ProductThumbnail> findByIsMainTrue();
}