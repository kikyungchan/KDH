package com.example.backend.product.controller;

import com.example.backend.product.dto.OrderDTO;
import com.example.backend.product.dto.ProductDto;
import com.example.backend.product.dto.ProductEditDto;
import com.example.backend.product.dto.ProductForm;
import com.example.backend.product.repository.ProductRepository;
import com.example.backend.product.service.OrderService;
import com.example.backend.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private final OrderService orderService;

    @PostMapping("/order")
    public ResponseEntity<?> order(@RequestBody OrderDTO dto) {
        try {
            orderService.order(dto);
            return ResponseEntity.ok("주문 완료");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("주문 실패: " + e.getMessage());
        }
    }


    @PutMapping(value = "/edit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void editProduct(@RequestParam Long id,
                            @RequestParam String productName,
                            @RequestParam Integer price,
                            @RequestParam String category,
                            @RequestParam String info,
                            @RequestParam Integer quantity,
                            @RequestParam(required = false) List<String> deletedImages,
                            @RequestPart(required = false) List<MultipartFile> newImages
    ) {
        ProductEditDto dto = new ProductEditDto();
        dto.setProductName(productName);
        dto.setPrice(price);
        dto.setCategory(category);
        dto.setInfo(info);
        dto.setQuantity(quantity);
        dto.setDeletedImages(deletedImages);
        dto.setNewImages(newImages);

        productService.edit(id, dto);
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
    public ResponseEntity<?> regist(@ModelAttribute ProductForm productForm) {
        System.out.println("productForm = " + productForm);
        productService.add(productForm);
        return ResponseEntity.ok().build();
    }

}
