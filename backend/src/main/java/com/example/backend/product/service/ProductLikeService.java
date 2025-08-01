package com.example.backend.product.service;

import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.MemberRepository;
import com.example.backend.product.entity.Product;
import com.example.backend.product.entity.ProductLike;
import com.example.backend.product.repository.ProductLikeRepository;
import com.example.backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductLikeService {
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;
    private final ProductLikeRepository productLikeRepository;
    private final JwtDecoder jwtDecoder;

    private Integer extractMemberId(String token) {
        token = token.replace("Bearer ", "");
        Jwt decoded = jwtDecoder.decode(token);
        return Integer.valueOf(decoded.getSubject());
    }

    public boolean getLikeStatus(Integer productId, String auth) {
        Integer memberId = extractMemberId(auth);
        Member member = memberRepository.findById(memberId).get();
        Product product = productRepository.findById(productId).get();

        return productLikeRepository.existsByMemberAndProduct(member, product);
    }

    public int getLikeCount(Integer productId) {
        Product product = productRepository.findById(productId).get();
        return productLikeRepository.countByProduct(product);
    }

    public boolean toggleLike(Integer productId, String auth) {
        Integer memberId = extractMemberId(auth);
        Member member = memberRepository.findById(memberId).get();
        Product product = productRepository.findById(productId).get();

        ProductLike existingLike = productLikeRepository.findByMemberAndProduct(member, product);

        if (existingLike != null) {
            productLikeRepository.delete(existingLike);
            return false;
        } else {
            ProductLike newLike = new ProductLike();
            newLike.setProduct(product);
            newLike.setMember(member);
            productLikeRepository.save(newLike);
            return true;
        }
    }
}
