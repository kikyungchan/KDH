package com.example.backend.product.controller;

import com.example.backend.member.dto.MemberDto;
import com.example.backend.member.repository.MemberRepository;
import com.example.backend.product.dto.*;
import com.example.backend.product.entity.GuestOrder;
import com.example.backend.product.entity.Product;
import com.example.backend.product.repository.GuestOrderRepository;
import com.example.backend.product.repository.ProductRepository;
import com.example.backend.product.service.ProductService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.eclipse.angus.mail.imap.protocol.INTERNALDATE;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private final JwtDecoder jwtDecoder;
    private final MemberRepository memberRepository;
    private final GuestOrderRepository guestOrderRepository;
    private final ProductRepository productRepository;

    public class OrderTokenGenerator {
        private static final SecureRandom random = new SecureRandom();

        public static String generateToken() {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 12; i++) {
                sb.append(random.nextInt(10));
            }
            return sb.toString();
        }
    }

    // 비회원 주문
    @PostMapping("/order/guest")
    public ResponseEntity<?> createGuestOrder(@RequestBody List<GuestOrderRequestDto> dto) {
        List<GuestOrder> result = new ArrayList<>();
        // 비회원 주문 시
        for (GuestOrderRequestDto dtoList : dto) {
            // todo : 나중에
            Product product = productRepository.findById((dtoList.getProductId())).get();
            if (product.getQuantity() < dtoList.getQuantity()) {
                throw new RuntimeException("재고가 부족합니다.");
            }
            product.setQuantity(product.getQuantity() - dtoList.getQuantity());
            productRepository.save(product);

            // 주문객체 생성
            GuestOrder order = new GuestOrder();
            order.setGuestName(dtoList.getGuestName());
            order.setGuestPhone(dtoList.getGuestPhone());
            order.setReceiverName(dtoList.getReceiverName());
            order.setReceiverPhone(dtoList.getReceiverPhone());
            order.setShippingAddress(dtoList.getShippingAddress());
            order.setDetailedAddress(dtoList.getDetailedAddress());
            order.setPostalCode(dtoList.getPostalCode());
            order.setProductId(dtoList.getProductId());
            order.setProductName(dtoList.getProductName());
            order.setOptionId(dtoList.getOptionId());
            order.setOptionName(dtoList.getOptionName());
            order.setQuantity(dtoList.getQuantity());
            order.setPrice(dtoList.getPrice());
            order.setMemo(dtoList.getMemo());
            order.setTotalPrice(dtoList.getTotalPrice());

            String token = OrderTokenGenerator.generateToken();
            order.setGuestOrderToken(token);

            GuestOrder saved = guestOrderRepository.save(order);
            result.add(saved);
        }

        // 여러 건 주문이지만 첫 번째 주문번호를 리턴하거나 전체를 리턴
        return ResponseEntity.ok(Map.of(
                "guestOrderToken", result.get(0).getGuestOrderToken()  // 예시
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
        productService.order(reqList, auth);
        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/edit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void editProduct(@RequestParam Integer id,
                            @RequestParam String productName,
                            @RequestParam Integer price,
                            @RequestParam String category,
                            @RequestParam String info,
                            @RequestParam Integer quantity,
                            @RequestParam(required = false) List<String> deletedImages,
                            @RequestPart(required = false) List<MultipartFile> newImages
    ) {
        ProductEditDto dto = new ProductEditDto();
        dto.setProductName(productName);
        dto.setPrice(price);
        dto.setCategory(category);
        dto.setInfo(info);
        dto.setQuantity(quantity);
        dto.setDeletedImages(deletedImages);
        dto.setNewImages(newImages);

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
    public ResponseEntity<?> list(@RequestParam(defaultValue = "1") Integer page) {
        return ResponseEntity.ok(productService.list(page));
    }

    @PostMapping(value = "/regist", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> regist(@RequestParam String productName,
                                    @RequestParam Integer price,
                                    @RequestParam Integer quantity,
                                    @RequestParam String category,
                                    @RequestParam String info,
                                    @RequestParam String options,
                                    @RequestParam("images") List<MultipartFile> images) {
//        System.out.println("productForm = " + productForm);
        ObjectMapper objectMapper = new ObjectMapper();
        List<ProductOptionDto> optionList;
        try {
            optionList = objectMapper.readValue(options, new TypeReference<List<ProductOptionDto>>() {
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("오류가 발생하였습니다.");
        }
        ProductForm form = new ProductForm();
        form.setProductName(productName);
        form.setPrice(price);
        form.setQuantity(quantity);
        form.setCategory(category);
        form.setInfo(info);
        form.setOptions(optionList);
        form.setImages(images);

        productService.add(form);

        return ResponseEntity.ok().build();
    }

}
