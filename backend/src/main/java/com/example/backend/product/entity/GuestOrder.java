package com.example.backend.product.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Entity
@Table(name = "guest_orders", schema = "prj4")
public class GuestOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "guest_name", length = 100)
    private String guestName;

    @Column(name = "guest_phone", length = 50)
    private String guestPhone;

    @Column(name = "guest_email", length = 100)
    private String guestEmail;

    @Column(name = "receiver_name", length = 100)
    private String receiverName;

    @Column(name = "receiver_phone", length = 50)
    private String receiverPhone;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "detailed_address")
    private String detailedAddress;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "option_id")
    private Integer optionId;

    @Column(name = "option_name")
    private String optionName;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private Integer price;

    @Column(name = "memo")
    private String memo;

    @Column(name = "guest_order_token")
    private String guestOrderToken;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

}