package com.example.backend.product.repository;

import com.example.backend.product.entity.Product;
import com.example.backend.product.entity.ProductOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductOptionRepository extends JpaRepository<ProductOption, Long> {
    ProductOption findByProductAndOptionName(Product product, String optionName);
}