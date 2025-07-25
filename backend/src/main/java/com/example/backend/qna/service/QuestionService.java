package com.example.backend.qna.service;

import com.example.backend.member.entity.Member;
import com.example.backend.product.entity.Product;
import com.example.backend.product.repository.ProductRepository;
import com.example.backend.product.service.ProductService;
import com.example.backend.product.service.S3Uploader;
import com.example.backend.qna.dto.QuestionAddForm;
import com.example.backend.qna.entity.Question;
import com.example.backend.qna.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.backend.member.repository.MemberRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class QuestionService {

    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;
    private final QuestionRepository questionRepository;

    public void view(int id) {

        return;
    }

    public void add(QuestionAddForm dto, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("권한이 없습니다.");
        }

        Question question = new Question();
        question.setTitle(dto.getTitle());
        question.setContent(dto.getContent());
        question.setCategory(dto.getCategory());
        System.out.println("getname : " + Integer.valueOf(authentication.getName()));
        Member user = memberRepository.findById(Integer.valueOf(authentication.getName())).get();
        System.out.println("user : " + user);
        question.setUser(user);
//        Product product = productRepository.findById(Long.valueOf(String.valueOf(dto.getProduct_id()))).get();
//        System.out.println("product : " + product);
//        question.setProduct(product);

        System.out.println("question : " + question);
//        questionRepository.save(question);


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
