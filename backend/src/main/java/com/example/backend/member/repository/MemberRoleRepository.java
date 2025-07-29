package com.example.backend.member.repository;

import com.example.backend.member.entity.Member;
import com.example.backend.member.entity.MemberRole;
import com.example.backend.member.entity.MemberRoleId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemberRoleRepository extends JpaRepository<MemberRole, MemberRoleId> {
    List<MemberRole> findByMember(Member member);
}