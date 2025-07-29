package com.example.backend.product.controller;

import com.example.backend.product.dto.CartDeleteRequest;
import com.example.backend.product.dto.CartItemDto;
import com.example.backend.product.dto.CartResponseDto;
import com.example.backend.product.dto.CartUpdateRequest;
import com.example.backend.product.service.CartService;
import com.example.backend.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class CartController {
    private final CartService cartService;
    private final ProductService productService;

    @DeleteMapping("/cart/deleteAll")
    public ResponseEntity<?> deleteAllCart(@RequestHeader("Authorization") String auth) {
        cartService.deleteAllCart(auth);
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/cart/delete")
    public ResponseEntity<?> deleteCartItem(@RequestBody List<CartDeleteRequest> deleteList,
                                            @AuthenticationPrincipal Jwt jwt) {
        
        Integer memberId = Integer.parseInt(jwt.getSubject());
        cartService.deleteCartItem(memberId, deleteList);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cart")
    public ResponseEntity<?> addToCart(@RequestBody CartItemDto dto) {
        System.out.println("dto = " + dto);
//        cartService.add(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cart")
    public ResponseEntity<List<CartResponseDto>> cartList(@AuthenticationPrincipal Jwt jwt) {
        Integer memberId = Integer.parseInt(jwt.getSubject());
        List<CartResponseDto> list = cartService.getCartList(memberId);
        return ResponseEntity.ok(list);
    }

    @PutMapping("/cart/update")
    public ResponseEntity<?> updateCartItem(@RequestBody CartUpdateRequest req,
                                            @AuthenticationPrincipal Jwt jwt) {
        Integer memberId = Integer.parseInt(jwt.getSubject());
        cartService.updateCartItem(memberId, req);
        return ResponseEntity.ok().build();
    }

}
