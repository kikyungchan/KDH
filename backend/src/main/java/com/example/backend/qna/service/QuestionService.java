package com.example.backend.qna.service;

import com.example.backend.member.entity.Member;
import com.example.backend.product.entity.Product;
import com.example.backend.product.entity.ProductImage;
import com.example.backend.product.repository.ProductRepository;
import com.example.backend.qna.dto.QuestionAddForm;
import com.example.backend.qna.entity.Question;
import com.example.backend.qna.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.backend.member.repository.MemberRepository;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class QuestionService {

    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;
    private final QuestionRepository questionRepository;

    public Map<String, ?> view(int id, Authentication authentication) {
        Product product = productRepository.findById(Long.valueOf(String.valueOf(id))).get();
        List<String> imagePaths = product.getImages().stream().map(ProductImage::getStoredPath).toList();
        
        var qnainfo = Map.of("id", product.getId(),
                "image", imagePaths,
                "price", product.getPrice(),
                "productName", product.getProductName()
        );
        return qnainfo;
    }

    public void add(QuestionAddForm dto, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("권한이 없습니다.");
        }


        Question question = new Question();
        question.setTitle(dto.getTitle());
        question.setContent(dto.getContent());
        question.setCategory(dto.getCategory());
//        System.out.println("product : " + productRepository.findById(Long.valueOf(String.valueOf(dto.getProductId()))).get());
        Product product = productRepository.findById(Long.valueOf(String.valueOf(dto.getProductId()))).get();
        question.setProduct(product);

        Member user = memberRepository.findById(Integer.valueOf(authentication.getName())).get();
        question.setUser(user);

        question.setStatus("open");
        questionRepository.save(question);


    }

    public boolean validateForAdd(QuestionAddForm dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isBlank()) {
            return false;
        }

        if (dto.getContent() == null || dto.getContent().trim().isBlank()) {
            return false;
        }

        return true;
    }
}
