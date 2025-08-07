package com.example.backend.product.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "guest_order_item", schema = "prj4")
public class GuestOrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "guest_order_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private GuestOrder guestOrder;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "option_id")
    private ProductOption option;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "option_name")
    private String optionName;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "price", nullable = false)
    private Integer price;

    @Column(name = "total_price", nullable = false)
    private Integer totalPrice;
}
