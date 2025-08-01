package com.example.backend.pay.entity;

import com.example.backend.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Getter
@Setter
@ToString
@Entity
@Table(name = "payments", schema = "prj4")
public class Payment {
    @Id
    @Column(name = "payment_key", nullable = false, length = 50)
    private String paymentKey;

    @Column(name = "order_id", nullable = false, length = 50)
    private String orderId;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "order_name", nullable = false)
    private String orderName;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "requested_at", nullable = false)
    private OffsetDateTime requestedAt;

    @Column(name = "approved_at")
    private OffsetDateTime approvedAt;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "userid", referencedColumnName = "login_id")
    private Member userid;

    @Column(name = "transaction_key", length = 50)
    private String transactionKey;

    @Column(name = "receipt_url")
    private String receiptUrl;

    @Column(name = "error_code", length = 50)
    private String errorCode;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "mid", length = 50)
    private String mid;

    @Column(name = "version", length = 20)
    private String version;

    @Lob
    @Column(name = "virtual_account_info")
    private String virtualAccountInfo;

}