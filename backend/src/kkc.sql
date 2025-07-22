CREATE TABLE product
(
    id           BIGINT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(255)         NOT NULL,
    price        VARCHAR(255)         NOT NULL,
    category     VARCHAR(255)         NOT NULL,
    info         VARCHAR(255)          NULL,
    quantity     INT                  NOT NULL,
    inserted_at  datetime             NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_product PRIMARY KEY (id)
);