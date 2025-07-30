package com.example.backend.product.controller;

import com.example.backend.product.dto.ProductCommentDto;
import com.example.backend.product.entity.ProductComment;
import com.example.backend.product.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product/comment")
public class CommentController {
    private final CommentService commentService;

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
}
