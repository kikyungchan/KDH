#
상품
테이블
CREATE TABLE product
(
    id           INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(500)       NOT NULL,
    price        INT                NOT NULL,
    category     VARCHAR(255)       NOT NULL,
    info         VARCHAR(10000)     NULL,
    quantity     INT                NOT NULL,
    inserted_at  datetime           NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_product PRIMARY KEY (id)
);
ALTER TABLE product
    MODIFY price INT NOT NULL;

#상품
이미지를저장할
테이블
CREATE TABLE product_image
(
    id                 INT AUTO_INCREMENT NOT NULL,
    stored_path        VARCHAR(500)       NOT NULL,
    original_file_name VARCHAR(500)       NOT NULL,
    product_id         INT                NOT NULL,
    CONSTRAINT pk_productimage PRIMARY KEY (id)
);

ALTER TABLE product_image
    ADD CONSTRAINT FK_PRODUCTIMAGE_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES product (id);

#
페이징용더미데이터복사
INSERT INTO product (product_name, price, category, info, quantity)
SELECT CONCAT(product_name), price, category, info, quantity
FROM product;

-- 상품옵션 테이블
CREATE TABLE product_option
(
    id          INT AUTO_INCREMENT NOT NULL,
    option_name VARCHAR(255)       NOT NULL,
    price       INT                NOT NULL,
    product_id  INT                NOT NULL,
    CONSTRAINT pk_product_option PRIMARY KEY (id)
);

ALTER TABLE product_option
    ADD CONSTRAINT FK_PRODUCT_OPTION_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES product (id);

ALTER TABLE product_option
    MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT;


#
장바구니
테이블
CREATE TABLE cart
(
    id          INT AUTO_INCREMENT NOT NULL,
    product_id  INT                NOT NULL,
    option_id   INT                NOT NULL,
    quantity    INT                NOT NULL,
    inserted_at datetime           NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_cart PRIMARY KEY (id)
);
ALTER TABLE cart
    MODIFY COLUMN option_id INT NULL;

#
외래키
ALTER TABLE cart
    ADD CONSTRAINT FK_CART_ON_OPTION FOREIGN KEY (option_id) REFERENCES product_option (id);

ALTER TABLE cart
    ADD CONSTRAINT FK_CART_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES product (id);

#
order(주문정보) 테이블
CREATE TABLE orders
(
    id               INT AUTO_INCREMENT PRIMARY KEY,
    member_id        INT          NOT NULL,
    order_date       DATETIME     NOT NULL DEFAULT NOW(),
    total_price      INT          NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,

    CONSTRAINT fk_orders_member
        FOREIGN KEY (member_id) REFERENCES member (id)
            ON DELETE CASCADE
);
ALTER TABLE orders
    ADD COLUMN order_token VARCHAR(20);
ALTER TABLE orders
    ADD COLUMN zipcode VARCHAR(20);
ALTER TABLE orders
    ADD COLUMN address_detail VARCHAR(255);
ALTER TABLE orders
    ADD COLUMN login_id    VARCHAR(30) NOT NULL,
    ADD COLUMN member_name VARCHAR(50) NOT NULL;
ALTER TABLE orders
    ADD COLUMN product_name VARCHAR(255),
    ADD COLUMN option_name  VARCHAR(255);

ALTER TABLE orders
    ADD COLUMN product_id INT;

ALTER TABLE orders
    DROP
        COLUMN product_id;

ALTER TABLE orders
    ADD COLUMN created_at DATETIME NOT NULL DEFAULT NOW();

ALTER TABLE orders
    DROP
        COLUMN product_name,
    DROP
        COLUMN option_name;

# 새 컬럼 추가
ALTER TABLE prj4.orders
    ADD COLUMN orderer_name            VARCHAR(50)  NULL,
    ADD COLUMN orderer_phone           VARCHAR(30)  NULL,
    ADD COLUMN receiver_name           VARCHAR(50)  NULL,
    ADD COLUMN receiver_phone          VARCHAR(30)  NULL,
    ADD COLUMN receiver_zipcode        VARCHAR(20)  NULL,
    ADD COLUMN receiver_address        VARCHAR(255) NULL,
    ADD COLUMN receiver_address_detail VARCHAR(255) NULL,
    ADD COLUMN items_subtotal          INT          NULL,
    ADD COLUMN shipping_fee            INT          NULL;

# 기존 데이터 백필
UPDATE prj4.orders
SET orderer_name            = COALESCE(orderer_name, member_name),
    orderer_phone           = COALESCE(orderer_phone, phone),
    receiver_name           = COALESCE(receiver_name, member_name),  -- 기본값: 주문자=수령인
    receiver_phone          = COALESCE(receiver_phone, phone),
    receiver_address        = COALESCE(receiver_address, shipping_address),
    receiver_zipcode        = COALESCE(receiver_zipcode, zipcode),
    receiver_address_detail = COALESCE(receiver_address_detail, address_detail),
    items_subtotal          = COALESCE(items_subtotal, total_price), -- 과거 주문은 총액=소계 가정
    shipping_fee            = COALESCE(shipping_fee, 0);


ALTER TABLE prj4.orders
    ADD COLUMN member_name      VARCHAR(50) GENERATED ALWAYS AS (orderer_name) VIRTUAL,
    ADD COLUMN shipping_address VARCHAR(255) GENERATED ALWAYS AS (receiver_address) VIRTUAL,
    ADD COLUMN zipcode          VARCHAR(20) GENERATED ALWAYS AS (receiver_zipcode) VIRTUAL,
    ADD COLUMN address_detail   VARCHAR(255) GENERATED ALWAYS AS (receiver_address_detail) VIRTUAL;

SHOW CREATE TABLE prj4.orders;

ALTER TABLE orders
    MODIFY COLUMN order_token VARCHAR(30) NOT NULL;


#
비회원
주문정보 테이블
CREATE TABLE guest_orders
(
    id                INT PRIMARY KEY AUTO_INCREMENT,
    guest_name        VARCHAR(100),
    guest_phone       VARCHAR(50),
    receiver_name     VARCHAR(100),
    receiver_phone    VARCHAR(50),
    shipping_address  VARCHAR(255),
    detailed_address  VARCHAR(255),
    postal_code       VARCHAR(20),
    product_id        INT,
    product_name      VARCHAR(255),
    option_id         INT,
    option_name       VARCHAR(255),
    quantity          INT,
    price             INT,
    memo              VARCHAR(255),
    guest_order_token VARCHAR(255), -- UUID 등
    created_at        DATETIME DEFAULT NOW()
);

ALTER TABLE guest_orders
    ADD COLUMN total_price INT;

ALTER TABLE guest_orders
    ADD COLUMN items_subtotal INT NULL,
    ADD COLUMN shipping_fee   INT NULL;

ALTER TABLE guest_orders
    ADD COLUMN order_date DATETIME NOT NULL DEFAULT NOW();



#
order_item(주문상세)
# price: 주문 시점의 옵션 가격 (가격 변경 이력 보존용)
# 외래키로 orders, product, product_option 참조
CREATE TABLE order_item
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    order_id   INT NOT NULL,
    product_id INT NOT NULL,
    option_id  INT NOT NULL,
    quantity   INT NOT NULL,
    price      INT NOT NULL,

    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id) REFERENCES orders (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_order_item_product
        FOREIGN KEY (product_id) REFERENCES product (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_order_item_option
        FOREIGN KEY (option_id) REFERENCES product_option (id)
            ON DELETE CASCADE
);
ALTER TABLE order_item
    MODIFY option_id INT NULL;

ALTER TABLE product
    ADD detail_text VARCHAR(5000) NULL;

#
리뷰
테이블
CREATE TABLE product_comment
(
    id         INT AUTO_INCREMENT NOT NULL,
    product_id INT                NULL,
    member_id  INT                NULL,
    content    TEXT               NOT NULL,
    created_at datetime           NULL,
    CONSTRAINT pk_product_comment PRIMARY KEY (id)
);

ALTER TABLE product_comment
    MODIFY created_at datetime null default now();

#
리뷰테이블에
별점칼럼 추가
ALTER TABLE product_comment
    ADD COLUMN rating INT NOT NULL;


#
좋아요
테이블
CREATE TABLE product_like
(
    id         INT AUTO_INCREMENT NOT NULL,
    member_id  INT                NULL,
    product_id INT                NULL,
    CONSTRAINT pk_product_like PRIMARY KEY (id)
);

ALTER TABLE product_like
    ADD CONSTRAINT uc_eddc7679868d4979a9c6687aa UNIQUE (member_id, product_id);

ALTER TABLE product_like
    ADD CONSTRAINT FK_PRODUCT_LIKE_ON_MEMBER FOREIGN KEY (member_id) REFERENCES prj4.member (id);

ALTER TABLE product_like
    ADD CONSTRAINT FK_PRODUCT_LIKE_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES product (id);

CREATE TABLE product_thumbnail
(
    id                 INT AUTO_INCREMENT NOT NULL,
    stored_path        VARCHAR(1000)      NOT NULL,
    original_file_name VARCHAR(1000)      NOT NULL,
    product_id         INT                NOT NULL,
    is_main            BOOLEAN            NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    CONSTRAINT fk_product_thumbnail_product
        FOREIGN KEY (product_id)
            REFERENCES product (id)
            ON DELETE CASCADE
);

ALTER TABLE product_thumbnail
    ADD CONSTRAINT FK_PRODUCT_THUMBNAIL_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES product (id);

SELECT *
FROM product_thumbnail
WHERE is_main = true;

ALTER TABLE prj4.order_item
    ADD COLUMN product_name VARCHAR(255),
    ADD COLUMN option_name  VARCHAR(255),
    ADD COLUMN total_price  INT;

#
게스트오더아이템테이블
CREATE TABLE prj4.guest_order_item
(
    id             INT AUTO_INCREMENT NOT NULL,
    guest_order_id INT                NOT NULL,
    product_id     INT                NULL,
    option_id      INT                NULL,
    product_name   VARCHAR(255)       NULL,
    option_name    VARCHAR(255)       NULL,
    quantity       INT                NOT NULL,
    price          INT                NOT NULL,
    total_price    INT                NOT NULL,
    CONSTRAINT pk_guest_order_item PRIMARY KEY (id)
);

ALTER TABLE prj4.guest_order_item
    ADD CONSTRAINT FK_GUEST_ORDER_ITEM_ON_GUEST_ORDERS FOREIGN KEY (guest_order_id) REFERENCES prj4.guest_orders (id) ON DELETE CASCADE;

ALTER TABLE prj4.guest_order_item
    ADD CONSTRAINT FK_GUEST_ORDER_ITEM_ON_OPTION FOREIGN KEY (option_id) REFERENCES product_option (id);

ALTER TABLE prj4.guest_order_item
    ADD CONSTRAINT FK_GUEST_ORDER_ITEM_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES product (id);

ALTER TABLE guest_orders
    CHANGE detailed_address address_detail VARCHAR(255);

ALTER TABLE guest_orders
    CHANGE postal_code zipcode VARCHAR(20);


ALTER TABLE guest_orders
    DROP
        COLUMN product_id,
    DROP
        COLUMN product_name,
    DROP
        COLUMN option_id,
    DROP
        COLUMN option_name,
    DROP
        COLUMN quantity,
    DROP
        COLUMN price;