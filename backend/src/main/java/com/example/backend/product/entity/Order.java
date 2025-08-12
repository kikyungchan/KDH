package com.example.backend.product.entity;

import com.example.backend.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@Entity
@Table(name = "orders", schema = "prj4")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "login_id", nullable = false)
    private String loginId;

    @Column(name = "member_name", nullable = false)
    private String memberName;

    @Column(nullable = false)
    private String phone;

    @ColumnDefault("current_timestamp()")
    @Column(name = "order_date", updatable = false, insertable = false, nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "order_token")
    private String orderToken;

    @Column(name = "items_subtotal", nullable = false)
    private Integer itemsSubtotal;

    @Column(name = "shipping_fee", nullable = false)
    private Integer shippingFee;

    @Column(name = "total_price", nullable = false)
    private Integer totalPrice;

    @Column(name = "zipcode", nullable = false)
    private String zipcode;

    @Column(name = "shipping_address", nullable = false)
    private String shippingAddress;

    @Column(name = "address_detail", nullable = false)
    private String addressDetail;

    @Column(name = "memo", nullable = false)
    private String memo;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<OrderItem> orderItems = new ArrayList<>();

    public void addOrderItem(OrderItem item) {
        orderItems.add(item);
        item.setOrder(this);
    }


}
