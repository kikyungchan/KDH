package com.example.backend.product.repository;

import com.example.backend.member.entity.Member;
import com.example.backend.product.entity.Cart;
import com.example.backend.product.entity.Product;
import com.example.backend.product.entity.ProductOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByMemberId(Long memberId);

    List<Cart> findByMemberAndProductAndOption(Member member, Product product, ProductOption option);

    void deleteByMemberIdAndProductIdAndOptionId(Long memberId, Long productId, Long optionId);
//    List<Cart> findByUser(User user)
}