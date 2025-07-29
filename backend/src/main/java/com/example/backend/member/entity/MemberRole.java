package com.example.backend.member.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "member_role", schema = "prj4")
public class MemberRole {
    @EmbeddedId
    private MemberRoleId id;

    @MapsId("memberId")
    @ManyToOne(optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @MapsId("roleName")
    @ManyToOne(optional = false)
    @JoinColumn(name = "role_name", nullable = false)
    private Role roleName;

}