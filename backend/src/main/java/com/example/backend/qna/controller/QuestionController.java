package com.example.backend.qna.controller;

import com.example.backend.qna.dto.QuestionAddForm;
import com.example.backend.qna.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/qna")
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("add")
    @PreAuthorize("isAuthenticated()")
    public Map<String, ?> addQuestion(@RequestParam int id, Authentication authentication) {
        return questionService.addquestion(id, authentication);
    }

    @GetMapping("list")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> getAllBoards(
            @RequestParam(value = "q", defaultValue = "") String keyword,
            @RequestParam(value = "p", defaultValue = "1") Integer pageNumber) {

        System.out.println("keyword : " + keyword);
        System.out.println("pageNumber : " + pageNumber);
        return questionService.list(keyword, pageNumber);
    }


    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> add(@RequestBody QuestionAddForm dto,
                                 Authentication authentication) {
        // 유효성 검사
        boolean result = questionService.validateForAdd(dto);

        if (result) {
            questionService.add(dto, authentication);

            return ResponseEntity.ok().body(Map.of(
                    "message", Map.of(
                            "type", "success",
                            "text", "문의가 등록되었습니다.")));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", Map.of(
                            "type", "error",
                            "text", "입력한 내용이 유효하지 않습니다.")));
        }
    }
}
