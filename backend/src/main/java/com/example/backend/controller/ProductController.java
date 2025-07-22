package com.example.backend.controller;

import com.example.backend.dto.ProductForm;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    @PostMapping("/regist")
    public String regist(ProductForm productForm) {
        System.out.println("productForm = " + productForm);
//        productService.add(productForm);
        return null;
    }
}
