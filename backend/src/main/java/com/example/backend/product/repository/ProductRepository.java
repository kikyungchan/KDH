package com.example.backend.product.repository;

import com.example.backend.member.service.MemberService;
import com.example.backend.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Page<Product> findAllByOrderByIdDesc(Pageable pageable);

//    Product findById(Integer id);

//    MemberService findById(Integer id);

    List<Product> id(Integer id);

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.info) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.detailText) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}