package com.example.backend.controller;

import com.example.backend.dto.ProductForm;
import com.example.backend.entity.Product;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;

    @GetMapping("/list")
    public List<Product> list() {
        List<Product> dummy = new ArrayList<>();
        Product p1 = new Product();
        p1.setId(1L);
        p1.setProductName("테스트상품");
        p1.setPrice(1000);
        dummy.add(p1);
        return dummy;
    }
    
    @PostMapping("/regist")
    public String regist(ProductForm productForm) {
//        System.out.println("productForm = " + productForm);
        productService.add(productForm);
        return null;
    }

}
