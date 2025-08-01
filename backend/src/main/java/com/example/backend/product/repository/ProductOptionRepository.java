package com.example.backend.product.repository;

import com.example.backend.product.entity.Product;
import com.example.backend.product.dto.ProductOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductOptionRepository extends JpaRepository<ProductOption, Integer> {
    ProductOption findByProductAndOptionName(Product product, String optionName);
}