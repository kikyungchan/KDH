package com.example.backend.member.controller;

import com.example.backend.member.dto.*;
import com.example.backend.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    // 회원 등록
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid MemberForm memberForm,
                                    BindingResult bindingResult,
                                    Authentication authentication) {

        // 로그인 된 상태에서 회원가입 방어
        if (authentication != null &&
            authentication.isAuthenticated() &&
            !(authentication instanceof AnonymousAuthenticationToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of("message", Map.of("type", "error", "text", "이미 로그인되어 있습니다.")));
        }

        // 오류 메세지 보여주기
        // 입력값의 오류가 있을때(정규식과 일치하지않을때)
        if (bindingResult.hasErrors()) {
            String message = bindingResult.getAllErrors().get(0).getDefaultMessage();
            return ResponseEntity.status(400).body(
                    Map.of("message",
                            Map.of("type", "error",
                                    "text", message)));
        }

        // 아이디 중복 검사
        if (memberService.existByLoginId(memberForm.getLoginId())) {
            return ResponseEntity.status(400).body(
                    Map.of("message", Map.of(
                            "type", "error",
                            "text", "이미 사용중인 아이디입니다."
                    ))
            );
        }

        // 이메일 중복 검사
        if (memberService.existByEmail(memberForm.getEmail())) {
            return ResponseEntity.status(400).body(
                    Map.of("message", Map.of(
                            "type", "error",
                            "text", "이미 사용중인 이메일입니다."
                    ))
            );
        }

        // 유효성 검사를 통과했을 때 실행
        memberService.signup(memberForm);
        return ResponseEntity.ok().body(
                Map.of("message",
                        Map.of("type", "success",
                                "text", "회원 가입 되었습니다.")));

    }

    // 아이디 중복 확인
    @GetMapping("/check-id")
    public ResponseEntity<?> checkLoginId(@RequestParam String loginId) {

        boolean exists = memberService.existByLoginId(loginId);

        return ResponseEntity.ok(Map.of("exists", exists));
    }

    // 이메일 중복 확인
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {

        boolean exists = memberService.existByEmail(email);

        return ResponseEntity.ok(Map.of("exists", exists));
    }

    // 회원 리스트 조회
    @GetMapping("/list")
    @PreAuthorize("hasAuthority('admin')")
    public Map<String, Object> memberList(@RequestParam(value = "page", defaultValue = "1") Integer pageNumber) {
        System.out.println("success");
        return memberService.list(pageNumber);
    }

    // 회원 정보 조회
    @GetMapping(params = "id")
    @PreAuthorize("isAuthenticated() or hasAuthority('admin')")
    public ResponseEntity<?> getMember(@RequestParam Integer id, Authentication authentication) {
        if (authentication.getName().equals(id.toString()) ||
            authentication.getAuthorities().contains(new SimpleGrantedAuthority("admin"))) {
            return ResponseEntity.ok().body(memberService.get(id));
        } else {
            return ResponseEntity.status(403).build();
        }
    }

    // 회원 탈퇴
    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteMember(@RequestBody @Valid MemberDeleteForm memberDeleteForm,
                                          Authentication authentication) {
        // 로그인한 회원 본인만 탈퇴 가능
        if (!authentication.getName().equals(memberDeleteForm.getId().toString())) {
            return ResponseEntity.status(403).build();
        }
        boolean deleted = memberService.delete(memberDeleteForm);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 회원 정보 수정
    @PutMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateMember(@PathVariable Integer id,
                                          @RequestBody @Valid MemberUpdateForm memberUpdateForm,
                                          Authentication authentication,
                                          BindingResult bindingResult) {

        // 로그인한 회원 본인만 수정 가능
        if (!authentication.getName().equals(memberUpdateForm.getId().toString())) {
            return ResponseEntity.status(403).build();
        }

        // 입력값 일치하지않았을때
        if (bindingResult.hasErrors()) {
            String message = bindingResult.getAllErrors().get(0).getDefaultMessage();
            return ResponseEntity.status(400).body(
                    Map.of("message",
                            Map.of("type", "error",
                                    "text", message)));
        }

        try {
            memberService.update(id, memberUpdateForm);
        } catch (Exception e) {
            e.printStackTrace();
            String message = e.getMessage();
            return ResponseEntity.status(401).body(
                    Map.of("message",
                            Map.of("type", "error",
                                    "text", message)));
        }
        return ResponseEntity.ok().body(
                Map.of("message",
                        Map.of("type", "success",
                                "text", "회원 정보가 수정되었습니다.")));
    }

    // 비밀번호 수정
    @PutMapping("changePassword")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(@RequestBody @Valid ChangePasswordForm data,
                                            Authentication authentication) {
        // 로그인한 본인 아이디
        Integer memberId = Integer.valueOf(authentication.getName()); // JWT sub에서 추출

        try {
            memberService.changePassword(memberId, data);
        } catch (RuntimeException e) {
            e.printStackTrace();
            String message = e.getMessage();
            return ResponseEntity.status(403).body(
                    Map.of("message",
                            Map.of("type", "error",
                                    "text", message)));
        } catch (Exception e) {
            e.printStackTrace();
            String message = e.getMessage();
            // 403 : 권한 없음
            return ResponseEntity.status(500).body(
                    Map.of("message",
                            Map.of("type", "error",
                                    "text", message)));
        }
        return ResponseEntity.ok().body(
                Map.of("message",
                        Map.of("type", "success",
                                "text", "암호가 수정 되었습니다.")));
    }


    // 로그인
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody MemberLoginForm loginForm) {


        try {
            String token = memberService.getToken(loginForm);
            return ResponseEntity.ok().body(
                    Map.of("token", token,
                            "message",
                            Map.of("type", "success",
                                    "text", "로그인 되었습니다")));
        } catch (Exception e) {
            e.printStackTrace();
            String message = e.getMessage();
            return ResponseEntity.status(401).body(
                    Map.of("message",
                            Map.of("type", "error",
                                    "text", message)));
        }
    }

    @GetMapping("find-id")
    public ResponseEntity<?> findLoginId(@RequestParam String email) {
        try {
            String maskedId = memberService.findId(email);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "loginId", maskedId
            ));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

}

