package com.example.backend.product.controller;

import com.example.backend.member.dto.MemberDto;
import com.example.backend.member.repository.MemberRepository;
import com.example.backend.product.dto.*;
import com.example.backend.product.entity.*;
import com.example.backend.product.repository.GuestOrderRepository;
import com.example.backend.product.repository.ProductOptionRepository;
import com.example.backend.product.repository.ProductRepository;
import com.example.backend.product.repository.ProductThumbnailRepository;
import com.example.backend.product.service.ProductService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.awt.print.Pageable;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private final JwtDecoder jwtDecoder;
    private final MemberRepository memberRepository;
    private final GuestOrderRepository guestOrderRepository;
    private final ProductRepository productRepository;
    private final ProductThumbnailRepository productThumbnailRepository;
    private final ProductOptionRepository productOptionRepository;

    public class OrderTokenGenerator {
        private static final SecureRandom random = new SecureRandom();

        public static String generateToken() {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 16; i++) {
                sb.append(random.nextInt(10));
            }
            return sb.toString();
        }
    }

    // 비회원 주문
    @PostMapping("/order/guest")
    public ResponseEntity<?> createGuestOrder(@RequestBody List<GuestOrderRequestDto> dtoList) {
        if (dtoList.isEmpty()) {
            return ResponseEntity.badRequest().body("주문 항목이 없습니다.");
        }

        // 공통 GuestOrder 생성
        GuestOrder order = new GuestOrder();
        GuestOrderRequestDto first = dtoList.get(0); // 공통 배송/주문자 정보 기준

        order.setGuestName(first.getGuestName());
        order.setGuestPhone(first.getGuestPhone());
        order.setReceiverName(first.getReceiverName());
        order.setReceiverPhone(first.getReceiverPhone());
        order.setShippingAddress(first.getShippingAddress());
        order.setDetailedAddress(first.getDetailedAddress());
        order.setPostalCode(first.getPostalCode());
        order.setMemo(first.getMemo());

        String token = OrderTokenGenerator.generateToken();
        order.setGuestOrderToken(token);

        int totalOrderPrice = 0;
        List<GuestOrderItem> itemList = new ArrayList<>();

        for (GuestOrderRequestDto dto : dtoList) {
            System.out.println("➡ 옵션 ID: " + dto.getOptionId());
            System.out.println("➡ 옵션 이름: " + dto.getOptionName());
            System.out.println("➡ 옵션 ID: " + dto.getOptionId());
            System.out.println("➡ 옵션 이름: " + dto.getOptionName());
            System.out.println("➡ 옵션 ID: " + dto.getOptionId());
            System.out.println("➡ 옵션 이름: " + dto.getOptionName());
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("상품이 존재하지 않습니다."));

            if (product.getQuantity() < dto.getQuantity()) {
                throw new RuntimeException("재고가 부족합니다.");
            }

            // 재고 차감
            product.setQuantity(product.getQuantity() - dto.getQuantity());
            productRepository.save(product);

            // GuestOrderItem 생성
            GuestOrderItem item = new GuestOrderItem();
            item.setGuestOrder(order);
            item.setProduct(product);
            item.setProductName(product.getProductName());
            item.setQuantity(dto.getQuantity());
            item.setPrice(dto.getPrice());
            item.setTotalPrice(dto.getQuantity() * dto.getPrice());

            if (dto.getOptionId() != null) {
                ProductOption option = productOptionRepository.findById(dto.getOptionId()).orElse(null);
                System.out.println("🔍 DB에서 조회한 옵션: " + option);
                System.out.println("🔍 DB에서 조회한 옵션: " + option);
                System.out.println("🔍 DB에서 조회한 옵션: " + option);
                System.out.println("🔍 DB에서 조회한 옵션: " + option);
                item.setOption(option);
                item.setOptionName(option != null ? option.getOptionName() : null);
            }

            totalOrderPrice += item.getTotalPrice();
            itemList.add(item);
        }

        order.setTotalPrice(totalOrderPrice);
        order.setItems(itemList);

        guestOrderRepository.save(order); // 로 item도 같이 저장됨

        return ResponseEntity.ok(Map.of(
                "guestOrderToken", order.getGuestOrderToken()
        ));
    }


    @GetMapping("/member/info")
    public ResponseEntity<?> getMemberInfo(@RequestHeader("Authorization") String auth) {
        MemberDto dto = productService.getmemberinfo(auth);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/order")
    public ResponseEntity<?> createOrder(@RequestBody List<OrderRequest> reqList,
                                         @RequestHeader("Authorization") String auth) {

        String orderToken = productService.order(reqList, auth);
        return ResponseEntity.ok(Map.of("orderToken", orderToken));
    }

    @PostMapping(value = "/edit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void editProduct(@RequestParam Integer id,
                            @RequestParam String productName,
                            @RequestParam Integer price,
                            @RequestParam String category,
                            @RequestParam String info,
                            @RequestParam Integer quantity,
                            @RequestParam(required = false) List<String> deletedImages,
                            @RequestParam(required = false) List<MultipartFile> newImages,
                            @RequestParam(required = false) List<String> deletedThumbnails,
                            @RequestParam(required = false) List<MultipartFile> newThumbnails
    ) {
        ProductEditDto dto = new ProductEditDto();
        dto.setProductName(productName);
        dto.setPrice(price);
        dto.setCategory(category);
        dto.setInfo(info);
        dto.setQuantity(quantity);
        dto.setDeletedImages(deletedImages);
        dto.setNewImages(newImages);
        dto.setDeletedThumbnails(deletedThumbnails);
        dto.setNewThumbnails(newThumbnails);

        productService.edit(id, dto);
    }

    @DeleteMapping("/delete")
    public void delete(@RequestParam Integer id) {
        productService.delete(id);
    }

    @GetMapping("/view")
    public ProductDto view(@RequestParam(defaultValue = "") Integer id) {

        return productService.view(id);
    }

    @GetMapping("/list")
    public ResponseEntity<?> list(@RequestParam(defaultValue = "1") Integer page,
                                  @RequestParam(required = false) String keyword,
                                  @RequestParam(required = false) String sort,
                                  @RequestParam(required = false) String category) {
        return ResponseEntity.ok(productService.list(page, keyword, sort, category));
    }

    @PostMapping(value = "/regist", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> regist(@RequestParam String productName,
                                    @RequestParam Integer price,
                                    @RequestParam Integer quantity,
                                    @RequestParam String category,
                                    @RequestParam String info,
                                    @RequestParam String options,
                                    @RequestParam String detailText,
                                    @RequestParam("thumbnails") List<MultipartFile> thumbnails,
                                    @RequestParam("detailImages") List<MultipartFile> detailImages) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<ProductOptionDto> optionList;
        try {
            optionList = objectMapper.readValue(options, new TypeReference<List<ProductOptionDto>>() {
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("오류가 발생하였습니다.");
        }
        ProductRegistDto form = new ProductRegistDto();
        form.setProductName(productName);
        form.setPrice(price);
        form.setQuantity(quantity);
        form.setCategory(category);
        form.setInfo(info);
        form.setOptions(optionList);
        form.setThumbnails(thumbnails);
        form.setDetailImages(detailImages);
        form.setDetailText(detailText);

        productService.add(form);

        return ResponseEntity.ok().build();
    }


    // 우측배너
    @GetMapping("/hot-random")
    public ResponseEntity<List<ProductMainSlideDto>> getRandomHotProducts() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        PageRequest pageable = PageRequest.of(0, 5);
        List<ProductMainSlideDto> result = productRepository.findHotProductsRandomLimit(oneWeekAgo, pageable);
        return ResponseEntity.ok(result);
    }

    //좌측배너 썸네일이미지 주간판매량 10개이상 아이템 랜덤 1개
    @GetMapping("/main-thumbnail-random")
    public ResponseEntity<ThumbnailDto> getRandomMainThumbnail() {
        List<ProductThumbnail> mainThumbnails = productThumbnailRepository.findByIsMainTrue();
        if (mainThumbnails.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ProductThumbnail randomThumbnail = mainThumbnails.get(new SecureRandom().nextInt(mainThumbnails.size()));
        ThumbnailDto dto = new ThumbnailDto();
        dto.setStoredPath(randomThumbnail.getStoredPath());
        dto.setIsMain(true);
        return ResponseEntity.ok(dto);
    }

    // 누적판매량 제일 많은 아이템 3개
    @GetMapping("/best")
    public ResponseEntity<List<ProductBestDto>> getTopProducts() {
        List<ProductBestDto> topProducts = productService.getTopSellingProducts();
        return ResponseEntity.ok(topProducts);
    }
}
