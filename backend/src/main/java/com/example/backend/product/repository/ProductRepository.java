package com.example.backend.product.repository;

import com.example.backend.product.dto.ProductMainSlideDto;
import com.example.backend.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> id(Integer id);

    // 검색
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.info) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.detailText) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> findByKeyword(@Param("keyword") String keyword, Pageable pageable);


    // 전체상품인기순 (주문수많은 순서대로)
    @Query("""
            SELECT p FROM Product p
            LEFT JOIN OrderItem oi ON oi.product = p
            GROUP BY p
            ORDER BY SUM(oi.quantity) DESC
            """)
    Page<Product> findAllOrderByPopularity(Pageable pageable);

    // 키워드 유지하고 검색.
    @Query("""
                SELECT p FROM Product p
                LEFT JOIN OrderItem oi ON oi.product = p
                WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(p.info) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(p.detailText) LIKE LOWER(CONCAT('%', :keyword, '%'))
                GROUP BY p
                ORDER BY SUM(oi.quantity) DESC
            """)
    Page<Product> findByKeywordOrderByPopularity(String keyword, Pageable pageable);

    //우측 배너 주간판매량 10개이상 아이템 랜덤으로 최대 10개 까지
    @Query("""
                SELECT new com.example.backend.product.dto.ProductMainSlideDto(
                    p.id, p.productName, p.price, t.storedPath
                )
                FROM Product p
                JOIN p.thumbnails t
                WHERE t.isMain = true AND p.id IN (
                    SELECT oi.product.id FROM OrderItem oi
                    WHERE oi.order.createdAt > :oneWeekAgo
                    GROUP BY oi.product.id
                    HAVING SUM(oi.quantity) >= 10
                )
                ORDER BY FUNCTION('RAND')
            """)
    List<ProductMainSlideDto> findHotProductsRandomLimit(LocalDateTime oneWeekAgo, Pageable pageable);

    // 검색쿼리
    @Query("SELECT p FROM Product p WHERE p.category = :category AND " +
           "(LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.info) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.detailText) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> findByCategoryAndKeyword(@Param("category") String category,
                                           @Param("keyword") String keyword,
                                           Pageable pageable);

    Page<Product> findByCategory(String category, Pageable pageable);

    @Query("""
                SELECT p FROM Product p
                LEFT JOIN OrderItem oi ON oi.product = p
                WHERE p.category = :category
                GROUP BY p
                ORDER BY SUM(oi.quantity) DESC
            """)
    Page<Product> findByCategoryOrderByPopularity(@Param("category") String category, Pageable pageable);

    @Query("""
                SELECT p FROM Product p
                LEFT JOIN OrderItem oi ON oi.product = p
                WHERE p.category = :category AND (
                    LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                    LOWER(p.info) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                    LOWER(p.detailText) LIKE LOWER(CONCAT('%', :keyword, '%'))
                )
                GROUP BY p
                ORDER BY SUM(oi.quantity) DESC
            """)
    Page<Product> findByCategoryAndKeywordOrderByPopularity(@Param("category") String category, @Param("keyword") String keyword, Pageable pageable);

    //    누적판매량 제일 많은 아이템 3개
    @Query("""
            SELECT p
            FROM Product p
            LEFT JOIN OrderItem oi ON oi.product = p
            GROUP BY p.id
            ORDER BY COALESCE(SUM(oi.quantity), 0) DESC
            """)
    List<Product> findTopSellingProducts(Pageable pageable);

    @Query("""
            SELECT p
            FROM Product p
            LEFT JOIN OrderItem oi ON oi.product = p
            WHERE p.category = :category
            GROUP BY p.id
            ORDER BY COALESCE(SUM(oi.quantity), 0) DESC
            """)
    List<Product> findTopSellingProductsByCategory(@Param("category") String category, Pageable pageable);
}