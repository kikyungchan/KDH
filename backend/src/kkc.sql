# 상품 테이블
CREATE TABLE product
(
    id           INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(500)       NOT NULL,
    price        VARCHAR(255)       NOT NULL,
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
    ADD CONSTRAINT FK_CART_ON_OPTION FOREIGN KEY (option_id) REFERENCES product_option (id);

ALTER TABLE cart
    ADD CONSTRAINT FK_CART_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES product (id);

ALTER TABLE cart
    ADD COLUMN member_id INT,
    ADD CONSTRAINT fk_cart_member
        FOREIGN KEY (member_id)
            REFERENCES member (id);


