package com.example.backend.product.service;

import com.example.backend.product.dto.OrderDto;
import com.example.backend.product.dto.OrderItemDto;
import com.example.backend.product.entity.Order;
import com.example.backend.product.entity.OrderItem;
import com.example.backend.product.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
                .map(item -> {
                    OrderItemDto itemDto = new OrderItemDto();
                    itemDto.setProductName(item.getProduct().getProductName());
                    itemDto.setQuantity(item.getQuantity());
                    itemDto.setProductOption(item.getOrder().getOptionName());
                    itemDto.setPrice(item.getPrice());
                    return itemDto;
                }).toList();


        dto.setOrderItems(itemDtos);
        return dto;
    }
}
