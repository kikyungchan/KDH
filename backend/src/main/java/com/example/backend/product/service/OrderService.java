package com.example.backend.product.service;

import com.example.backend.product.dto.OrderDTO;
import com.example.backend.product.entity.Order;
import com.example.backend.product.entity.Product;
import com.example.backend.product.repository.OrderRepository;
import com.example.backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public void order(OrderDTO dto) {
        Product product = productRepository.findById(dto.getProductId()).get();
        Order order = new Order();
        if (product.getQuantity() < dto.getQuantity()) {
            throw new RuntimeException("재고가 부족합니다");
        }
        product.setQuantity(product.getQuantity() - dto.getQuantity());


        order.setProductName(product.getProductName());
        order.setQuantity(dto.getQuantity());
        order.setPrice(product.getPrice());
        order.setTotalPrice(product.getPrice() * dto.getQuantity());
//        order.setOrderDate(LocalDateTime.now()); 테이블에서 디폴트나우로 자동설정.
        orderRepository.save(order);
        productRepository.save(product);
    }
}
