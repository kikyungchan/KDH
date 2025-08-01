package com.example.backend.product.service;

import com.example.backend.member.entity.Member;
import com.example.backend.product.dto.ProductCommentDto;
import com.example.backend.product.entity.Product;
import com.example.backend.product.entity.ProductComment;
import com.example.backend.product.repository.OrderItemRepository;
import com.example.backend.product.repository.OrderRepository;
import com.example.backend.product.repository.ProductCommentRepository;
import com.example.backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductCommentService {

    private final JwtDecoder jwtDecoder;
    private final ProductRepository productRepository;
    private final ProductCommentRepository productCommentRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

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
            dto.setMemberId(comment.getMember().getId());
            result.add(dto);

        }
        return result;
    }

    public void deleteComment(Integer id, String auth) {
        Jwt jwt = jwtDecoder.decode(auth.replace("Bearer ", ""));
        Integer memberId = Integer.parseInt(jwt.getSubject());

        ProductComment comment = productCommentRepository.findById(id).get();
        productCommentRepository.delete(comment);
    }

    public void updateComment(Integer id, ProductCommentDto dto, String auth) {
        Jwt jwt = jwtDecoder.decode(auth.replace("Bearer ", ""));
        Integer memberId = Integer.parseInt(jwt.getSubject());

        ProductComment comment = productCommentRepository.findById(id).get();

        comment.setContent(dto.getContent());
        comment.setRating(dto.getRating());
        productCommentRepository.save(comment);
    }

    public boolean isPurchasable(Integer memberId, Integer productId) {
        // 구매이력 확인
        boolean hasPurchased = orderItemRepository.existsByMemberIdAndProductId(memberId, productId);
        boolean alreadyReviewed = productCommentRepository.existsByMemberIdAndProductId(memberId, productId);
        System.out.println("hasPurchased: " + hasPurchased);
        System.out.println("alreadyReviewed: " + alreadyReviewed);
        return hasPurchased && !alreadyReviewed;
    }

    public Map<String, Object> getReviewStats(Integer productId) {
        List<ProductComment> comments = productCommentRepository.findByProductId(productId);

        // 별점 별 개수 집계용 Map
        Map<Integer, Long> starCount = new HashMap<>();
        int totalScore = 0;
        for (ProductComment comment : comments) {
            int rating = comment.getRating();
            totalScore += rating;

            // 별점 개수 누적
            starCount.put(rating, starCount.getOrDefault(rating, 0L) + 1);
        }
        double avg = comments.isEmpty() ? 0.0 : (double) totalScore / comments.size();
        Map<String, Object> result = new HashMap<>();
        result.put("starCount", starCount);
        result.put("avg", avg);
        result.put("total", comments.size());
        return result;
    }
}
