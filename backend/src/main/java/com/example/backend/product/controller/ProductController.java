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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private final JwtDecoder jwtDecoder;
    private final MemberRepository memberRepository;
    private final GuestOrderRepository guestOrderRepository;

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
    public GuestOrder createGuestOrder(@RequestBody GuestOrderRequestDto dto) {

        // 비회원 주문 시
        GuestOrder order = new GuestOrder();
        order.setGuestName(dto.getGuestName());
        order.setGuestPhone(dto.getGuestPhone());
        order.setReceiverName(dto.getReceiverName());
        order.setReceiverPhone(dto.getReceiverPhone());
        order.setShippingAddress(dto.getShippingAddress());
        order.setDetailedAddress(dto.getDetailedAddress());
        order.setPostalCode(dto.getPostalCode());
        order.setProductId(dto.getProductId());
        order.setProductName(dto.getProductName());
        order.setOptionId(dto.getOptionId());
        order.setOptionName(dto.getOptionName());
        order.setQuantity(dto.getQuantity());
        order.setPrice(dto.getPrice());
        order.setMemo(dto.getMemo());
        order.setTotalPrice(dto.getTotalPrice());


        // guestOrderToken(주문번호) 자동생성(UUID)
//        String token = UUID.randomUUID().toString();
//        order.setGuestOrderToken(token);
        String token = OrderTokenGenerator.generateToken();
        order.setGuestOrderToken(token);

        //저장
        GuestOrder saved = guestOrderRepository.save(order);

        // 클라이언트에서 주문번호 확인할 수 있도록 전체 객체 또는 token만 리턴
        return saved;
    }

    @GetMapping("/member/info")
    public ResponseEntity<?> getMemberInfo(@RequestHeader("Authorization") String auth) {
        MemberDto dto = productService.getmemberinfo(auth);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/order")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest req,
                                         @RequestHeader("Authorization") String auth) {
        productService.order(req, auth);
        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/edit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void editProduct(@RequestParam Long id,
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
    public void delete(@RequestParam Long id) {
        productService.delete(id);
    }

    @GetMapping("/view")
    public ProductDto view(@RequestParam(defaultValue = "") Long id) {

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
