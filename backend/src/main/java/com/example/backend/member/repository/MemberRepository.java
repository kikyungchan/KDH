package com.example.backend.member.repository;

import com.example.backend.member.dto.MemberListDto;
import com.example.backend.member.dto.MemberListInfo;
import com.example.backend.member.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    List<MemberListInfo> findAllBy();

    boolean existsByLoginId(String loginId);

    Page<MemberListDto> findAllBy(PageRequest pageRequest);
}