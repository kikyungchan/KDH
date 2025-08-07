package com.example.backend.product.service;

import com.example.backend.product.dto.order.GuestLookupRequest;
import com.example.backend.product.dto.order.OrderDetailDto;
import com.example.backend.product.dto.order.OrderDto;
import com.example.backend.product.dto.order.OrderItemDto;
import com.example.backend.product.entity.GuestOrder;
import com.example.backend.product.entity.Order;
import com.example.backend.product.entity.OrderItem;
import com.example.backend.product.repository.GuestOrderRepository;
import com.example.backend.product.repository.OrderRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final GuestOrderRepository guestOrderRepository;


    public Page<OrderDto> getOrdersByUsersLoginId(Integer memberId, Pageable pageable) {
        // 전체 orderToken 리스트
            List<String> allTokens = orderRepository.findDistinctOrderTokensByMemberId(memberId);

            // 페이징 처리 수동 적용 (subList)
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), allTokens.size());

            List<String> pageTokens = allTokens.subList(start, end);

            List<OrderDto> dtoList = new ArrayList<>();

            for (String token : pageTokens) {
                List<Order> orders = orderRepository.findAllByOrderToken(token);

                if (!orders.isEmpty()) {
                    Order representative = orders.get(0); // 임의 대표
                    List<OrderItemDto> allItems = orders.stream()
                            .flatMap(o -> o.getOrderItems().stream())
                            .map(OrderItemDto::new)
                            .toList();

                    OrderDto dto = new OrderDto(representative);
                    dto.setOrderId(representative.getId());
                    dto.setOrderToken(token);
                    dto.setOrderDate(representative.getCreatedAt());
                    dto.setMemberName(representative.getMember().getName());
                    dto.setTotalPrice(
                            allItems.stream()
                                    .mapToInt(item -> item.getPrice() * item.getQuantity())
                                    .sum()
                    );
                    dto.setOrderItems(allItems);
                    dto.setStatus("구매 확정");

                    dtoList.add(dto);
                }
            }
            return new PageImpl<>(dtoList, pageable, allTokens.size());
    }



    // 주문 상세 조회
    public OrderDetailDto getOrderDetail(String orderToken, Integer memberId) {
        List<Order> orders = orderRepository.findAllByOrderToken(orderToken);


        if (orders.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "주문을 찾을 수 없습니다.");
        }

        // ✅ 첫 번째 Order만 사용 (임시 조치)
        Order representativeOrder = orders.get(0);

        if (!representativeOrder.getMember().getId().equals(memberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인의 주문만 조회할 수 있습니다.");
        }

        // ✅ 모든 주문의 아이템을 통합
        List<OrderItemDto> allItems = new ArrayList<>();
        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                allItems.add(new OrderItemDto(item));
            }
        }

        // ✅ 대표 주문 정보와 모든 상품으로 DTO 생성
        return new OrderDetailDto(representativeOrder, allItems);
    }

    public void verifyGuestOrder(GuestLookupRequest request, HttpSession session) {
        Optional<GuestOrder> guestOrder = guestOrderRepository.findByGuestOrderToken(request.getGuestOrderToken());

        if (guestOrder.isEmpty()) {
            throw new NoSuchElementException("주문을 찾을 수 없습니다.");
        }

        GuestOrder order = guestOrder.get();

        if (!order.getGuestName().equals(request.getGuestName()) ||
            !order.getGuestPhone().equals(request.getGuestPhone())) {
            throw new SecurityException("주문자 정보가 일치하지 않습니다");
        }
        session.setAttribute("guestOrderToken", order.getGuestOrderToken());
    }

    public GuestOrder getGuestOrderDetail(HttpSession session) {

        String token = (String) session.getAttribute("guestOrderToken");

        if (token == null) {
            throw new SecurityException("인증 정보가 없습니다");
        }

        return guestOrderRepository.findByGuestOrderToken(token)
                .orElseThrow(() -> new NoSuchElementException("주문을 찾을 수 없습니다."));
    }
}
