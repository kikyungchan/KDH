package com.example.backend.member.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "role", schema = "prj4")
public class Role {
    @Id
    @Column(name = "name", nullable = false, length = 30)
    private String name;

    //TODO [Reverse Engineering] generate columns from DB
}