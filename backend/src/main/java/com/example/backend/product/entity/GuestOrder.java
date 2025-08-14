package com.example.backend.product.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Column(name = "receiver_name", length = 100)
    private String receiverName;

    @Column(name = "receiver_phone", length = 50)
    private String receiverPhone;

    @Column(name = "shipping_address")
    private String receiverAddress;

    @Column(name = "address_detail")
    private String receiverAddressDetail;

    @Column(name = "zipcode", length = 20)
    private String receiverZipcode;

    @Column(name = "items_subtotal", nullable = false)
    private Integer itemsSubtotal;

    @Column(name = "shipping_fee", nullable = false)
    private Integer shippingFee;

    @Column(name = "total_price", nullable = false)
    private Integer totalPrice;

    @Column(name = "memo")
    private String memo;

    @Column(name = "guest_order_token")
    private String guestOrderToken;

    @ColumnDefault("current_timestamp()")
    @Column(name = "order_date", updatable = false, insertable = false, nullable = false)
    private LocalDateTime orderDate;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "guestOrder", cascade = CascadeType.ALL)
    private List<GuestOrderItem> items = new ArrayList<>();

}