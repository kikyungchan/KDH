package com.example.backend.product.service;

import com.example.backend.member.entity.Member;
import com.example.backend.product.dto.ProductCommentDto;
import com.example.backend.product.entity.Product;
import com.example.backend.product.entity.ProductComment;
import com.example.backend.product.repository.ProductCommentRepository;
import com.example.backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {

    private final JwtDecoder jwtDecoder;
    private final ProductRepository productRepository;
    private final ProductCommentRepository productCommentRepository;

    public void addComment(ProductCommentDto dto, String auth) {
        Jwt jwt = jwtDecoder.decode(auth.replace("Bearer ", ""));
        Integer memberId = Integer.parseInt(jwt.getSubject());
        Product product = productRepository.findById(dto.getProductId()).get();
        Member member = new Member();
        member.setId(memberId);

        ProductComment comment = new ProductComment();
        comment.setProduct(product);
        comment.setMember(member);
        comment.setContent(dto.getContent());
        comment.setRating(dto.getRating());

        productCommentRepository.save(comment);

    }

    public List<ProductCommentDto> getComments(Integer productId) {
        List<ProductComment> comments = productCommentRepository.findByProductIdOrderByIdDesc(productId);
        List<ProductCommentDto> result = new ArrayList<>();
        for (ProductComment comment : comments) {
            ProductCommentDto dto = new ProductCommentDto();
            dto.setId(comment.getId());
            dto.setContent(comment.getContent());
            dto.setMemberLoginId(comment.getMember().getLoginId());
            dto.setCreatedAt(comment.getCreatedAt());
            dto.setProductId(productId);
            dto.setRating(comment.getRating());
            result.add(dto);

        }
        return result;
    }

}
