package com.example.backend.member.service;

import com.example.backend.member.dto.MemberDto;
import com.example.backend.member.dto.MemberForm;
import com.example.backend.member.dto.MemberListDto;
import com.example.backend.member.dto.MemberListInfo;
import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;

    // 회원 등록
    public void signup(MemberForm memberForm) {
        Member member = new Member();
        member.setLoginId(memberForm.getLoginId());
        member.setPassword(memberForm.getPassword());
        member.setName(memberForm.getName());
        member.setBirthday(memberForm.getBirthday());
        member.setPhone(memberForm.getPhone());
        member.setEmail(memberForm.getEmail());
        member.setAddress(memberForm.getAddress());
        memberRepository.save(member);
    }

    // 회원 리스트 불러오기
    public Map<String, Object> list(Integer pageNumber) {

        System.out.println("asdasda");
        Page<MemberListDto> memberListDtoPage
                = memberRepository.findAllBy(PageRequest.of(pageNumber - 1, 10));

        Integer totalPages = memberListDtoPage.getTotalPages();
        Integer rightPageNumber = ((pageNumber - 1) / 10 + 1) * 10;
        Integer leftPageNumber = rightPageNumber - 9;
        rightPageNumber = Math.min(rightPageNumber, totalPages);
        leftPageNumber = Math.max(leftPageNumber, 1);
        System.out.println("totalPages = " + totalPages);
        System.out.println("rightPageNumber = " + rightPageNumber);
        System.out.println("leftPageNumber = " + leftPageNumber);

        var pageInfo = Map.of(
                "totalPages", totalPages,
                "rightPageNumber", rightPageNumber,
                "leftPageNumber", leftPageNumber,
                "currentPageNumber", pageNumber
        );

        System.out.println("pageNumber = " + pageNumber);
        System.out.println("page result = " + memberListDtoPage.getContent());
        return Map.of("pageInfo", pageInfo,
                "memberList", memberListDtoPage.getContent());

    }

    // 회원 상세 정보 불러오기
    public MemberDto get(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));

        MemberDto memberDto = new MemberDto();
        memberDto.setId(member.getId());
        memberDto.setLoginId(member.getLoginId());
        memberDto.setName(member.getName());
        memberDto.setBirthday(member.getBirthday());
        memberDto.setPhone(member.getPhone());
        memberDto.setEmail(member.getEmail());
        memberDto.setAddress(member.getAddress());

        return memberDto;
    }

    public boolean delete(MemberForm memberForm) {
        Member db = memberRepository.findById(memberForm.getId())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));

//        // 비밀번호 불일치 시
//        if (!db.getPassword().equals(memberForm.getPassword())) {
//            return false;
//        }

        memberRepository.delete(db);
        return true;
    }

    public void update(long id, MemberForm memberForm) {

        // 1. 회원 조회
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다"));
        // 2. 수정
        member.setName(memberForm.getName());
        member.setPassword(memberForm.getPassword());
        member.setBirthday(memberForm.getBirthday());
        member.setPhone(memberForm.getPhone());
        member.setEmail(memberForm.getEmail());
        member.setAddress(memberForm.getAddress());
        // 3 저장
        memberRepository.save(member);
    }

    public boolean existByLoginId(String loginId) {
        return memberRepository.existsByLoginId(loginId);
    }
}
