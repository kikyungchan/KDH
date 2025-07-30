package com.example.backend.faq.controller;

import com.example.backend.faq.service.FaqService;
import com.example.backend.qna.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/faq")
public class FaqController {

    private final QuestionService questionService;
    private final FaqService faqService;

    @GetMapping("list")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> getAllFaqs(
            @RequestParam(value = "q", defaultValue = "") String keyword,
            @RequestParam(value = "p", defaultValue = "1") Integer pageNumber,
            Authentication authentication) {

        faqService.hasPermission(authentication);

        return faqService.list(keyword, pageNumber);
    }
}
