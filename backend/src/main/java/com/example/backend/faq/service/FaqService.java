package com.example.backend.faq.service;

import com.example.backend.faq.dto.FaqListDto;
import com.example.backend.faq.respository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class FaqService {
    private final FaqRepository faqRepository;

    public void hasPermission(Authentication authentication) {
        System.out.println("로그인 여부 확인");
        // 로그인 여부 확인해주는 메서드
        if (authentication == null) {
            throw new RuntimeException("권한이 없습니다.");
        }
    }

    public Map<String, Object> list(String keyword, Integer pageNumber) {
        Page<FaqListDto> faqListDtoPage
                = faqRepository.findAllBy(keyword, PageRequest.of(pageNumber - 1, 10));

        int totalPages = faqListDtoPage.getTotalPages(); // 마지막 페이지
        int rightPageNumber = ((pageNumber - 1) / 10 + 1) * 10;
        int leftPageNumber = rightPageNumber - 9;
        rightPageNumber = Math.min(rightPageNumber, totalPages);
        leftPageNumber = Math.max(leftPageNumber, 1);

        System.out.println("faqList" + faqListDtoPage.getContent());

        var pageInfo = Map.of("totalPages", totalPages,
                "rightPageNumber", rightPageNumber,
                "leftPageNumber", leftPageNumber,
                "currentPageNumber", pageNumber);

        return Map.of("pageInfo", pageInfo,
                "faqList", faqListDtoPage.getContent());
    }
}
