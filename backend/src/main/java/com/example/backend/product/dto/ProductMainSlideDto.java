package com.example.backend.product.dto;

import com.example.backend.product.entity.Product;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductMainSlideDto {
    private Integer id;
    private String productName;
    private Integer price;
    private String thumbnailUrl;

    public static ProductMainSlideDto from(Product product) {
        ProductMainSlideDto dto = new ProductMainSlideDto();
        dto.setId(product.getId());
        dto.setProductName(product.getProductName());
        dto.setPrice(product.getPrice());
//        if (!product.getImages().isEmpty()) {
//            dto.setThumbnailUrl(product.getImages().get(0).getStoredPath());
//        } else {
//            dto.setThumbnailUrl("/default.jpg");
//        }
//        return dto;
        // 1) 썸네일 우선 (isMain=true가 있으면 그거, 없으면 첫 번째)
        if (product.getThumbnails() != null && !product.getThumbnails().isEmpty()) {
            String thumbUrl = product.getThumbnails().stream()
                    .filter(t -> Boolean.TRUE.equals(t.getIsMain()))
                    .findFirst()
                    .orElse(product.getThumbnails().get(0))
                    .getStoredPath();
            dto.setThumbnailUrl(thumbUrl);
            return dto;
        }

        // 2) 썸네일이 아예 없다면, 임시로 본문 이미지 첫 장을 사용 (fallback)
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            dto.setThumbnailUrl(product.getImages().get(0).getStoredPath());
            return dto;
        }

        // 3) 둘 다 없으면 기본 이미지
        dto.setThumbnailUrl("/default.jpg");
        return dto;
    }

    public ProductMainSlideDto(Integer id, String productName, Integer price, String thumbnailUrl) {
        this.id = id;
        this.productName = productName;
        this.price = price;
        this.thumbnailUrl = thumbnailUrl;
    }
}
