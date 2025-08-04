package com.example.backend.product.repository;

import com.example.backend.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
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
            ORDER BY COUNT(oi.id) DESC
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
                ORDER BY COUNT(oi.id) DESC
            """)
    Page<Product> findByKeywordOrderByPopularity(String keyword, Pageable pageable);

    // 주간 주문량 10개이상 아이템 5개 랜덤
    @EntityGraph(attributePaths = "images")
    @Query("SELECT p FROM Product p WHERE p.id IN (" +
           "SELECT oi.product.id FROM OrderItem oi " +
           "WHERE oi.order.createdAt > :oneWeekAgo " +
           "GROUP BY oi.product.id " +
           "HAVING SUM(oi.quantity) >= 10" +
           ") ORDER BY FUNCTION('RAND')")
    List<Product> findHotProductsRandomLimit(LocalDateTime oneWeekAgo, PageRequest pageable);

    @Query("SELECT p FROM Product p WHERE p.category = :category AND " +
           "(LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.info) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.detailText) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> findByCategoryAndKeyword(@Param("category") String category,
                                           @Param("keyword") String keyword,
                                           Pageable pageable);

//    @Query("SELECT p FROM Product p LEFT JOIN OrderItem oi ON oi.product = p " +
//           "WHERE p.category = :category GROUP BY p.id ORDER BY COUNT(oi.id) DESC")
//    Page<Product> findByCategoryOrderByPopularity(@Param("category") String category,
//                                                  Pageable pageable);

//    @Query("SELECT p FROM Product p LEFT JOIN OrderItem oi ON oi.product = p " +
//           "WHERE p.category = :category AND " +
//           "(LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
//           "OR LOWER(p.info) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
//           "OR LOWER(p.detailText) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
//           "GROUP BY p.id ORDER BY COUNT(oi.id) DESC")
//    Page<Product> findByCategoryAndKeywordOrderByPopularity(@Param("category") String category,
//                                                            @Param("keyword") String keyword,
//                                                            Pageable pageable);


    Page<Product> findByCategory(String category, Pageable pageable);

    @Query("""
                SELECT p FROM Product p
                LEFT JOIN OrderItem oi ON oi.product = p
                WHERE p.category = :category
                GROUP BY p
                ORDER BY COUNT(oi.id) DESC
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
                ORDER BY COUNT(oi.id) DESC
            """)
    Page<Product> findByCategoryAndKeywordOrderByPopularity(@Param("category") String category, @Param("keyword") String keyword, Pageable pageable);
}