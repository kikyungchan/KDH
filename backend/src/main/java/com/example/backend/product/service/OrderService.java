package com.example.backend.product.service;

import com.example.backend.product.dto.OrderDto;
import com.example.backend.product.entity.Order;
import com.example.backend.product.entity.OrderItem;
import com.example.backend.product.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;


    public Page<OrderDto> getOrdersByUsersLoginId(String loginId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByMember_LoginId(loginId, pageable);

        return orders.map(this::convertToDto);
    }

    private OrderDto convertToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setOrderId(order.getId());
        dto.setOrderToken(order.getOrderToken());
        dto.setOrderDate(order.getOrderDate());
        dto.setMemberName(order.getMemberName());
        dto.setProductName(order.getProductName());
        dto.setOptionName(order.getOptionName());
        dto.setTotalPrice(order.getTotalPrice());

        if (order.getTotalPrice() != null && !order.getOrderItems().isEmpty()) {
            OrderItem firstItem = order.getOrderItems().get(0);
            dto.setQuantity(firstItem.getQuantity());

            if(firstItem.getProduct() != null){
                dto.setImageUrl(null);
            }
        }

        dto.setStatus("구매 확정");
        return dto;
    }
}
