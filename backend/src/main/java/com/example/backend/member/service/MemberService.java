package com.example.backend.member.service;

import com.example.backend.member.dto.*;
import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    // 회원 등록
    public void signup(MemberForm memberForm) {
        Member member = new Member();
        member.setLoginId(memberForm.getLoginId());
        member.setPassword(passwordEncoder.encode(memberForm.getPassword()));
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
    public MemberDto get(Integer id) {
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

    public boolean delete(MemberDeleteForm memberDeleteForm) {
        Member db = memberRepository.findById(memberDeleteForm.getId())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));

        String oldPassword = memberDeleteForm.getOldPassword(); // 기존 password

        // 비밀번호 불일치 시
        if (!passwordEncoder.matches(oldPassword, db.getPassword())) {
            return false;
        }

        memberRepository.delete(db);
        return true;
    }

    public void update(Integer id, MemberUpdateForm memberUpdateForm) {

        // 1. 회원 조회
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다"));

        String oldPassword = memberUpdateForm.getOldPassword(); // 기존 password
        String newPassword = memberUpdateForm.getNewPassword(); // 새 password


        // 2. 기존 비밀번호 일치 여부 확인
        if (!passwordEncoder.matches(oldPassword, member.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 수정
        member.setName(memberUpdateForm.getName());
        member.setBirthday(memberUpdateForm.getBirthday());
        member.setPhone(memberUpdateForm.getPhone());
        member.setEmail(memberUpdateForm.getEmail());
        member.setAddress(memberUpdateForm.getAddress());

        // 새 비밀번호가 입력된 경우에만 변경
        if (newPassword != null && !newPassword.isBlank()) {
            if (passwordEncoder.matches(newPassword, member.getPassword())) {
                throw new RuntimeException("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
            }

            member.setPassword(passwordEncoder.encode(newPassword));
        }

        // 5. 저장
        memberRepository.save(member);
    }

    public boolean existByLoginId(String loginId) {
        return memberRepository.existsByLoginId(loginId);
    }

    public void changePassword(Integer memberId, ChangePasswordForm data) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));

        String oldPassword = data.getOldPassword(); // 현재 password
        String newPassword = data.getNewPassword(); // 새 password

        System.out.println(passwordEncoder.matches("choi1563", "$2a$10$07IJyschqLEPkgS1iNyWsuzPjtpmjqOuEycUvJo1uN/arc9uCt6Da"));

        System.out.println("입력한 현재 비밀번호: " + data.getOldPassword());
        System.out.println("DB 저장 비밀번호: " + member.getPassword());
        System.out.println("매치 결과: " + passwordEncoder.matches(data.getOldPassword(), member.getPassword()));


        // 1. 기존 비밀번호 확인
        if (!passwordEncoder.matches(oldPassword, member.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 2. 새 비밀번호 입력 확인
        if (newPassword == null || newPassword.isBlank()) {
            throw new RuntimeException("새 비밀번호를 입력해주세요.");
        }

        // 3. 기존과 동일한 비밀번호 사용 방지
        if (passwordEncoder.matches(newPassword, member.getPassword())) {
            throw new RuntimeException("새 비밀번호는 현재 비밀번호와 달라야합니다.");
        }
        // 4. 암호화 후 저장
        member.setPassword(passwordEncoder.encode(newPassword));
        memberRepository.save(member);
    }

    // 로그인 토큰 생성
    public String getToken(MemberLoginForm loginForm) {
        // 아이디가 맞는지
        Member member = memberRepository.findByLoginId(loginForm.getLoginId())
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다"));

        // 비밀번호가 맞지 않았을때
        if (!passwordEncoder.matches(loginForm.getPassword(), member.getPassword())) {
            throw new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다");
        }

        // 토큰 생성
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(String.valueOf(member.getId()))       // primaryKey 인 id
                .claim("loginId", member.getLoginId())         // 필요한 claim(loginId)
                .issuer("self")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60 * 60 * 24)) // 1일 유효
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}
