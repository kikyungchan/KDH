package com.example.backend.product.controller;

import com.example.backend.product.dto.CartItemDto;
import com.example.backend.product.dto.CartResponseDto;
import com.example.backend.product.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class CartController {
    private final CartService cartService;

    @PostMapping("/cart")
    public ResponseEntity<?> addToCart(@RequestBody CartItemDto dto) {
        System.out.println("dto = " + dto);
        cartService.add(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cart")
    public ResponseEntity<List<CartResponseDto>> cartList() {
        List<CartResponseDto> list = cartService.getCartList();
        return ResponseEntity.ok(list);
    }

}
