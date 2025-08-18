package com.example.backend.alert.service;

import com.example.backend.alert.dto.AlertAddForm;
import com.example.backend.alert.dto.AlertDto;
import com.example.backend.alert.dto.AlertListDto;
import com.example.backend.alert.entity.Alert;
import com.example.backend.alert.respository.AlertRepository;
import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.MemberRepository;
import com.example.backend.product.entity.Product;
import com.example.backend.product.entity.ProductImage;
import com.example.backend.qna.dto.QuestionAddForm;
import com.example.backend.qna.entity.Question;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final MemberRepository memberRepository;

    public Map<String, Object> list(String keyword, Integer pageNumber, Authentication authentication) {

        String userId = null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof Jwt) {
            Jwt jwt = (Jwt) principal;
            userId = jwt.getClaimAsString("loginId");
        }

        System.out.println("userId = " + userId);

        Page<AlertListDto> alertListDtoPage
                = alertRepository.findAllBy(keyword, userId, PageRequest.of(pageNumber - 1, 10));


        int totalPages = alertListDtoPage.getTotalPages(); // 마지막 페이지
        int rightPageNumber = ((pageNumber - 1) / 10 + 1) * 10;
        int leftPageNumber = rightPageNumber - 9;
        rightPageNumber = Math.min(rightPageNumber, totalPages);
        leftPageNumber = Math.max(leftPageNumber, 1);


        var pageInfo = Map.of("totalPages", totalPages,
                "rightPageNumber", rightPageNumber,
                "leftPageNumber", leftPageNumber,
                "currentPageNumber", pageNumber);

        return Map.of("pageInfo", pageInfo,
                "alertList", alertListDtoPage.getContent());
    }


    public void hasPermission(Authentication authentication) {
        System.out.println("로그인 여부 확인");
        // 로그인 여부 확인해주는 메서드
        if (authentication == null) {
            throw new RuntimeException("권한이 없습니다.");
        }
    }

    public void add(AlertAddForm dto, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("권한이 없습니다.");
        }


        Alert alert = new Alert();
        alert.setTitle(dto.getTitle());
        alert.setContent(dto.getContent());
        alert.setLink(dto.getLink());
        Member requester = memberRepository.findById(Integer.valueOf(authentication.getName())).get();
        alert.setRequester(requester);
        
        Member user = memberRepository.findByLoginId(dto.getUser()).get();
        alert.setUser(user);

        alert.setStatus("open");
        alertRepository.save(alert);


    }

    public boolean validateForAdd(AlertAddForm dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isBlank()) {
            return false;
        }

        if (dto.getContent() == null || dto.getContent().trim().isBlank()) {
            return false;
        }

        return true;
    }
}
