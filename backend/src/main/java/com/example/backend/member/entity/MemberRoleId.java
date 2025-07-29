package com.example.backend.member.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@ToString
@Embeddable
public class MemberRoleId implements Serializable {
    private static final long serialVersionUID = 5255826943295214401L;
    @Column(name = "member_id", nullable = false)
    private Integer memberId;

    @Column(name = "role_name", nullable = false, length = 30)
    private String roleName;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        MemberRoleId entity = (MemberRoleId) o;
        return Objects.equals(this.roleName, entity.roleName) &&
               Objects.equals(this.memberId, entity.memberId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(roleName, memberId);
    }

}