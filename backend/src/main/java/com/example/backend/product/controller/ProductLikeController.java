package com.example.backend.product.controller;

import com.example.backend.product.service.ProductLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductLikeController {

    private final ProductLikeService productLikeService;

    @GetMapping("/{id}/like-status")
    public ResponseEntity<?> getLikestatus(@PathVariable("id") Integer productId,
                                           @RequestHeader("Authorization") String auth) {
        boolean liked = productLikeService.getLikeStatus(productId, auth);
        int count = productLikeService.getLikeCount(productId);
        return ResponseEntity.ok().body(new LikeResponse(liked, count));
    }

    @PostMapping("/{productId}/toggle-like")
    public ResponseEntity<?> toggleLike(@PathVariable Integer productId,
                                        @RequestHeader("Authorization") String auth) {
        boolean nowLiked = productLikeService.toggleLike(productId, auth);
        int count = productLikeService.getLikeCount(productId);
        return ResponseEntity.ok().body(new LikeResponse(nowLiked, count));
    }

    record LikeResponse(boolean liked, int count) {
    }
}
