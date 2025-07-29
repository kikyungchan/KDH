package com.example.backend.product.repository;

import com.example.backend.member.service.MemberService;
import com.example.backend.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Page<Product> findAllByOrderByIdDesc(Pageable pageable);

//    Product findById(Integer id);

//    MemberService findById(Integer id);

    List<Product> id(Integer id);
}