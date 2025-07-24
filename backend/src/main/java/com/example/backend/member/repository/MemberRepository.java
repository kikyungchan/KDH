package com.example.backend.member.repository;

import com.example.backend.member.dto.MemberListDto;
import com.example.backend.member.dto.MemberListInfo;
import com.example.backend.member.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    List<MemberListInfo> findAllBy();

    boolean existsByLoginId(String loginId);

    @Query("""
            SELECT new com.example.backend.member.dto.MemberListDto(
                m.id, m.loginId, m.name, m.phone, m.email
            )
            FROM Member m
            """)
    Page<MemberListDto> findAllBy(Pageable pageable);
}