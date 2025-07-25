package com.example.backend.qna.controller;

import com.example.backend.qna.service.QnAService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
@RequestMapping("/qna")
public class QnAController {

    private final QnAService QnAservice;

    @GetMapping("/view")
    public void QnAview(@RequestParam(defaultValue = "") Long id) {

//        return QnAservice.view(id);

    }

    @PostMapping
    public void Qnaadd() {
    }
}
