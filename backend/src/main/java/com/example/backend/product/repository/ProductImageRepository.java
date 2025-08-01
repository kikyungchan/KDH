package com.example.backend.product.repository;

import com.example.backend.product.dto.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    void deleteByStoredPath(String path);

    @Query(value = """
            SELECT img.storedPath
            FROM ProductImage img
            WHERE img.product.id = :id
            """)
    List<String> findByProductid(int id);
}