package com.example.backend.product.controller;

import com.example.backend.member.repository.MemberRepository;
import com.example.backend.product.dto.order.OrderDetailDto;
import com.example.backend.product.dto.order.OrderDto;
import com.example.backend.product.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/order/")
public class OrderController {


    private final OrderService orderService;
    private final JwtDecoder jwtDecoder;
    private final MemberRepository memberRepository;

    // 주문 목록 조회
    @GetMapping("/list")
    public Page<OrderDto> getOrderList(Authentication authentication,
                                       @PageableDefault(
                                               size = 5,
                                               sort = "orderDate",
                                               direction = Sort.Direction.DESC) Pageable pageable) {
        Integer memberId = Integer.parseInt(authentication.getName());
        return orderService.getOrdersByUsersLoginId(memberId, pageable);
    }

    // 주문 상세 조회
    @GetMapping("/detail/{orderToken}")
    private ResponseEntity<OrderDetailDto> getOrderDetail(@PathVariable String orderToken,
                                                          @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        Jwt decode = jwtDecoder.decode(token);
        Integer memberId = Integer.parseInt(decode.getSubject());

        OrderDetailDto dto = orderService.getOrderDetail(orderToken, memberId);
        return ResponseEntity.ok(dto);
    }

    // 비회원 주문 조회

}
