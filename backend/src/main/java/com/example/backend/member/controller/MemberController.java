package com.example.backend.member.controller;

import com.example.backend.member.dto.MemberForm;
import com.example.backend.member.dto.MemberListInfo;
import com.example.backend.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    // 회원 등록
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid MemberForm memberForm,
                                    BindingResult bindingResult) {
        // 오류 메세지 보여주기
        // 입력값의 오류가 있을때(정규식과 일치하지않을때)
        if (bindingResult.hasErrors()) {
            String message = bindingResult.getAllErrors().get(0).getDefaultMessage();
            return ResponseEntity.status(400).body(
                    Map.of("message",
                            Map.of("type", "error",
                                    "text", message)));
        }
        // 유효성 검사를 통과했을 때 실행
        memberService.signup(memberForm);
        return ResponseEntity.ok().body(
                Map.of("message",
                        Map.of("type", "success",
                                "text", "회원 가입 되었습니다.")));

    }

    // 회원 리스트 조회
    @GetMapping("/list")
    public Map<String, Object> memberList(@RequestParam(value = "page", defaultValue = "1") Integer pageNum) {
        return memberService.list(pageNum);
    }

    // 회원 정보 조회
    @GetMapping(params = "id")
    public ResponseEntity<?> getMember(@RequestParam Long id) {
        return ResponseEntity.ok().body(memberService.get(id));
    }

    // 회원 탈퇴
    @DeleteMapping
    public ResponseEntity<?> deleteMember(@RequestBody MemberForm memberForm) {
        boolean deleted = memberService.delete(memberForm);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 회원 정보 수정
    @PutMapping("{id}")
    public ResponseEntity<?> updateMember(@PathVariable long id,
                                          @RequestBody @Valid MemberForm memberForm,
                                          BindingResult bindingResult) {

        // 입력값 일치하지않았을때
        if (bindingResult.hasErrors()) {
            String message = bindingResult.getAllErrors().get(0).getDefaultMessage();
            return ResponseEntity.status(400).body(
                    Map.of("message",
                            Map.of("type", "error",
                                    "text", message)));
        }

        try {
            memberService.update(id, memberForm);
        } catch (Exception e) {
            e.printStackTrace();
            String message = e.getMessage();
            return ResponseEntity.status(403).body(
                    Map.of("message",
                            Map.of("type", "error",
                                    "text", message)));
        }
        return ResponseEntity.ok().body(
                Map.of("message",
                        Map.of("type", "success",
                                "text", "회원 정보가 수정되었습니다.")));
    }

    // 아이디 중복 확인
    @GetMapping("/check-id")
    public ResponseEntity<?> checkLoginId(@RequestParam String loginId) {

        boolean exists = memberService.existByLoginId(loginId);

        return ResponseEntity.ok(Map.of("exists", exists));
    }
}
