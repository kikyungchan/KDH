package com.example.backend.product.dto.order;

import com.example.backend.product.entity.GuestOrderItem;
import com.example.backend.product.entity.OrderItem;

import com.example.backend.product.entity.Product;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderItemDto {
    private Integer productId;

    private String productName;

    private Integer quantity;

    private String productOption;

    private Integer price;

    private String thumbnailUrl;

    // 생성자
    public OrderItemDto(OrderItem item) {
        this.productId = item.getProduct().getId();
        this.productName = item.getProduct().getProductName();
        this.productOption = item.getOption() != null
                ? item.getOption().getOptionName()
                : "기본"; // 옵션이 없을 경우 대비
        this.quantity = item.getQuantity();
        this.price = item.getPrice();
        this.thumbnailUrl = item.getProduct().getThumbnails().isEmpty()
                ? null
                : item.getProduct().getThumbnails().get(0).getStoredPath();
    }

    // ✅ 회원 주문용 정적 팩토리 (스트림에서 쓰기 편함)
    public static OrderItemDto fromEntity(OrderItem item) {
        return new OrderItemDto(item);
    }

    /**
     * 비회원(게스트) 주문용: 기본 생성자 + 세터로 채움
     */
    public static OrderItemDto fromEntity(GuestOrderItem item) {
        Product p = item.getProduct();
        OrderItemDto dto = new OrderItemDto();
        dto.setProductId(p != null ? p.getId() : null);
        dto.setProductName((item.getProductName() != null) ? item.getProductName()
                : (p != null ? p.getProductName() : null));
        dto.setQuantity(item.getQuantity());
        dto.setProductOption((item.getOptionName() != null) ? item.getOptionName()
                : (item.getOption() != null ? item.getOption().getOptionName() : "기본"));
        dto.setPrice(item.getPrice());
        dto.setThumbnailUrl(firstThumb(p));
        return dto;
    }

    private static String firstThumb(Product p) {
        if (p == null || p.getThumbnails() == null || p.getThumbnails().isEmpty()) return null;
        return p.getThumbnails().get(0).getStoredPath(); // 프로젝트 필드명에 맞게
    }

}
