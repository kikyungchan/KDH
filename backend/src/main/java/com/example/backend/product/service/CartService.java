package com.example.backend.product.service;

import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.MemberRepository;
import com.example.backend.product.dto.CartDeleteRequest;
import com.example.backend.product.dto.CartItemDto;
import com.example.backend.product.dto.CartResponseDto;
import com.example.backend.product.dto.CartUpdateRequest;
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
    private final LoginUtill loginUtill;
    private final MemberRepository memberRepository;


    public void add(CartItemDto dto) {
        Long memberId = loginUtill.getLoginMemberId();
        Member member = memberRepository.findById(memberId).get();
        Product product = productRepository.findById(dto.getProductId()).get();
        ProductOption option = productOptionRepository.findByProductAndOptionName(product, dto.getOptionName());

        // 옵션 중복 체크 ( 동일회원 + 상품 + 옵션)
        List<Cart> existingList = cartRepository.findByMemberAndProductAndOption(member, product, option);

        if (!existingList.isEmpty()) {
            Cart merged = existingList.get(0);
            int totalQty = dto.getQuantity();

            for (int i = 1; i < existingList.size(); i++) {
                totalQty += existingList.get(i).getQuantity();
                cartRepository.delete(existingList.get(i));
            }
            merged.setQuantity(merged.getQuantity() + dto.getQuantity());
            cartRepository.save(merged);
        } else {
            Cart cart = new Cart();
            cart.setProduct(product);
            cart.setOption(option);
            cart.setQuantity(dto.getQuantity());
            cart.setMember(member);
            cartRepository.save(cart);
        }
    }

    public List<CartResponseDto> getCartList() {
        Long memberId = loginUtill.getLoginMemberId();
        List<Cart> carts = cartRepository.findByMemberId(memberId);
        List<CartResponseDto> result = new ArrayList<>();
        for (Cart cart : carts) {
            CartResponseDto dto = new CartResponseDto(cart);
            result.add(dto);
        }
        return result;
    }


    public void deleteCartItem(Long memberId, List<CartDeleteRequest> deleteList) {
        for (CartDeleteRequest req : deleteList) {
            cartRepository.deleteById(req.getCartId());
        }

    }

    public void updateCartItem(Long memberId, CartUpdateRequest req) {
        Cart cart = cartRepository.findById(req.getCartId()).get();
        ProductOption option = productOptionRepository.findById(req.getOptionId()).get();
        cart.setOption(option);
        cart.setQuantity(req.getQuantity());
        cartRepository.save(cart);
    }
}
