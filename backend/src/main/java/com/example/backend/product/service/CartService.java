package com.example.backend.product.service;

import com.example.backend.product.dto.CartItemDto;
import com.example.backend.product.dto.CartResponseDto;
import com.example.backend.product.entity.Cart;
import com.example.backend.product.entity.Product;
import com.example.backend.product.entity.ProductOption;
import com.example.backend.product.repository.CartRepository;
import com.example.backend.product.repository.ProductOptionRepository;
import com.example.backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final ProductOptionRepository productOptionRepository;


    public void add(CartItemDto dto) {
        Product product = productRepository.findById(dto.getProductId()).get();
        ProductOption option = productOptionRepository.findByProductAndOptionName(product, dto.getOptionName());
        Cart cart = new Cart();
        cart.setProduct(product);
        cart.setOption(option);
        cart.setQuantity(dto.getQuantity());

        cartRepository.save(cart);
    }

    public List<CartResponseDto> getCartList() {
        List<Cart> carts = cartRepository.findAll();
        List<CartResponseDto> result = new ArrayList<>();
        for (Cart cart : carts) {
            CartResponseDto dto = new CartResponseDto(cart);
            result.add(dto);
        }
        return result;
    }
}
