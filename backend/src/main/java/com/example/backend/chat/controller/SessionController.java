package com.example.backend.chat.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SessionController {
   /* @PostMapping("/api/set-username")
    public ResponseEntity<Void> setUsername(
            @RequestParam String username,
            HttpSession session
    ) {
        // 세션에 username 속성으로 저장
        session.setAttribute("username", username);
        return ResponseEntity.ok().build();
    }*/
}
