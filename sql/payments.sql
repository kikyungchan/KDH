create table payments
(
    order_id             VARCHAR(50)  not null,
    amount               int          not null,
    status               VARCHAR(50)  not null,
    order_name           varchar(255) not null,
    payment_method       varchar(255) not null,
    requested_at         datetime     not null,
    approved_at          datetime     null,
    userid               varchar(50)  null,
    payment_key          varchar(50)  not null,
    transaction_key      varchar(50)  null,
    receipt_url          varchar(255) null,
    error_code           VARCHAR(50)  NULL,
    error_message        VARCHAR(255) NULL,
    mid                  VARCHAR(50)  NULL,
    version              varchar(20),
    virtual_account_info JSON         NULL,
    PRIMARY KEY (`payment_key`),
    INDEX `idx_order_id` (`order_id`),
    CONSTRAINT fk_payments_userid
        FOREIGN KEY (userid)
            REFERENCES member (login_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE


)