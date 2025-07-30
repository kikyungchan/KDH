# 상품 테이블
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

#상품 이미지를저장할 테이블
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

# 페이징용더미데이터복사
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


# 장바구니 테이블
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

# 외래키
ALTER TABLE cart
    ADD CONSTRAINT FK_CART_ON_OPTION FOREIGN KEY (option_id) REFERENCES product_option (id);

ALTER TABLE cart
    ADD CONSTRAINT FK_CART_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES product (id);

# order(주문정보) 테이블
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

# 비회원 주문정보 테이블
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



# order_item(주문상세)
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


