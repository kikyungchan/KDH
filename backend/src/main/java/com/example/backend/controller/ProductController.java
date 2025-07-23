package com.example.backend.controller;

import com.example.backend.dto.ProductDto;
import com.example.backend.dto.ProductForm;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;

    @PutMapping("/edit")
    public void editProduct(@RequestParam Long id, @RequestBody ProductForm productForm) {
        productService.edit(id, productForm);
    }

    @DeleteMapping("/delete")
    public void delete(@RequestParam Long id) {
        productService.delete(id);
    }

    @GetMapping("/view")
    public ProductDto view(@RequestParam(defaultValue = "") Long id) {

        return productService.view(id);
    }

    @GetMapping("/list")
    public ResponseEntity<?> list(@RequestParam(defaultValue = "1") Integer page) {
        return ResponseEntity.ok(productService.list(page));
    }

    @PostMapping("/regist")
    public String regist(ProductForm productForm) {
//        System.out.println("productForm = " + productForm);
        productService.add(productForm);
        return null;
    }

}
