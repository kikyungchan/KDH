package com.example.backend.product.repository;

import com.example.backend.member.entity.Member;
import com.example.backend.product.entity.Cart;
import com.example.backend.product.entity.Product;
import com.example.backend.product.dto.ProductOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    List<Cart> findByMemberId(Integer memberId);

    List<Cart> findByMemberAndProductAndOption(Member member, Product product, ProductOption option);

//    void deleteByMemberIdAndProductIdAndOptionId(Long memberId, Long productId, Long optionId);

    void deleteByMemberId(Integer memberId);

    List<Cart> findByProduct(Product product);

//    List<Cart> findByMemberId(Integer memberId);

//    List<Cart> findByUser(User user)
}