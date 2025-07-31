package com.example.backend.product.controller;

import com.example.backend.product.dto.ProductCommentDto;
import com.example.backend.product.entity.ProductComment;
import com.example.backend.product.repository.OrderItemRepository;
import com.example.backend.product.repository.OrderRepository;
import com.example.backend.product.repository.ProductCommentRepository;
import com.example.backend.product.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product/comment")
public class CommentController {
    private final CommentService commentService;
    private final JwtDecoder jwtDecoder;
    private final OrderRepository orderRepository;
    private final JwtEncoder jwtEncoder;
    private final OrderItemRepository orderItemRepository;
    private final ProductCommentRepository productCommentRepository;

    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody ProductCommentDto dto,
                                        @RequestHeader("Authorization") String auth) {
        commentService.addComment(dto, auth);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{productId}")
    public List<ProductCommentDto> getComments(@PathVariable Integer productId) {
        return commentService.getComments(productId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Integer id, @RequestHeader("Authorization") String auth) {
        commentService.deleteComment(id, auth);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Integer id, @RequestBody ProductCommentDto dto, @RequestHeader("Authorization") String auth) {
        commentService.updateComment(id, dto, auth);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkPurchasable(@RequestParam Integer productId, @RequestHeader("Authorization") String auth) {
        Jwt jwt = jwtDecoder.decode(auth.replace("Bearer ", ""));
        Integer memberId = Integer.parseInt(jwt.getSubject());

        boolean hasPurchased = orderItemRepository.existsByMemberIdAndProductId(memberId, productId);
        boolean alreadyReviewed = productCommentRepository.existsByMemberIdAndProductId(memberId, productId);

        Map<String, Boolean> result = new HashMap<>();
        result.put("hasPurchased", hasPurchased);
        result.put("alreadyReviewed", alreadyReviewed);

        return ResponseEntity.ok().body(result);
    }


}
