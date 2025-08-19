package com.example.backend.product.repository;

import com.example.backend.member.entity.Member;
import com.example.backend.product.entity.Product;
import com.example.backend.product.entity.RecentView;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecentViewRepository extends JpaRepository<RecentView, Integer> {

    // 최신순 Top10
    List<RecentView> findTop10ByMemberOrderByViewedAtDesc(Member member);

    // 특정 상품 중복 방지용 ( 있으면 delete 후 insert )
    Optional<RecentView> findByMemberAndProduct(Member member, Product product);

    // 최근본 상품중 삭제된 상품 있으면 최근 본 상품 목록에서도 삭제
    void deleteByProduct(Product product);
}