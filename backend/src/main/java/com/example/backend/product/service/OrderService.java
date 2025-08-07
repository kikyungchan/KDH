package com.example.backend.product.service;

import com.example.backend.product.dto.OrderDetailDto;
import com.example.backend.product.dto.OrderDto;
import com.example.backend.product.dto.OrderItemDto;
import com.example.backend.product.entity.Order;
import com.example.backend.product.entity.OrderItem;
import com.example.backend.product.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;


    public Page<OrderDto> getOrdersByUsersLoginId(Integer memberId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByMember_Id(memberId, pageable);
        System.out.println("⏬ Order 개수: " + orders.getContent().size());
        orders.forEach(o -> System.out.println("📦 OrderToken: " + o.getOrderToken() + ", ID: " + o.getId()));
        return orders.map(this::convertToDto);
    }

    private OrderDto convertToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setOrderId(order.getId());
        dto.setOrderToken(order.getOrderToken());
        dto.setOrderDate(order.getOrderDate());
        dto.setMemberName(order.getMemberName());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus("구매 확정");

        if (order.getTotalPrice() != null && !order.getOrderItems().isEmpty()) {
            OrderItem firstItem = order.getOrderItems().get(0);

            if (firstItem.getProduct() != null) {
                dto.setImageUrl(null);
            }
        }

        List<OrderItemDto> itemDtos = order.getOrderItems().stream()
                .map(OrderItemDto::new) // ✅ 생성자 방식
                .toList();


        dto.setOrderItems(itemDtos);
        return dto;
    }

    public OrderDetailDto getOrderDetail(String orderToken, Integer memberId) {
        List<Order> orders = orderRepository.findAllByOrderToken(orderToken);

        if (orders.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "주문을 찾을 수 없습니다.");
        }

        // ✅ 첫 번째 Order만 사용 (임시 조치)
        Order order = orders.get(0);

        if (!order.getMember().getId().equals(memberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인의 주문만 조회할 수 있습니다.");
        }

        System.out.println("✅ 주문 상세 조회 성공: " + orderToken);
        return new OrderDetailDto(order);
    }
}
