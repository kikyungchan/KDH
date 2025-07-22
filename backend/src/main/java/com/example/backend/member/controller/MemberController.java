package com.example.backend.member.controller;

import com.example.backend.member.dto.MemberForm;
import com.example.backend.member.dto.MemberListInfo;
import com.example.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    // 회원 등록
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody MemberForm memberForm) {
        memberService.signup(memberForm);
        return ResponseEntity.ok().build();
    }

    // 회원 리스트 조회
    @GetMapping("/list")
    public List<MemberListInfo> list() {
        return memberService.list();
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
    public ResponseEntity<?> updateMember(@RequestBody MemberForm memberForm) {
        try {
            memberService.update(memberForm);
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


}
