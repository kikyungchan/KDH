package com.example.backend.product.repository;

import com.example.backend.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> id(Integer id);

    // 검색
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.info) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.detailText) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> findByKeyword(@Param("keyword") String keyword, Pageable pageable);


    // 전체상품인기순
    @Query("""
            SELECT p FROM Product p
            LEFT JOIN OrderItem oi ON oi.product = p
            GROUP BY p
            ORDER BY COUNT(oi.id) DESC
            """)
    Page<Product> findAllOrderByPopularity(Pageable pageable);

    @Query("""
                SELECT p FROM Product p
                LEFT JOIN OrderItem oi ON oi.product = p
                WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(p.info) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(p.detailText) LIKE LOWER(CONCAT('%', :keyword, '%'))
                GROUP BY p
                ORDER BY COUNT(oi.id) DESC
            """)
    Page<Product> findByKeywordOrderByPopularity(String keyword, Pageable pageable);
}