CREATE TABLE question
(
    id         INT AUTO_INCREMENT                NOT NULL,
    product_id INT                               NOT NULL,
    user_id    VARCHAR(30)                       NOT NULL,
    title      VARCHAR(50)                       NOT NULL,
    content    varchar(255)                      NOT NULL,
    status     ENUM ('open','answered','closed') NOT NULL DEFAULT 'open',
    created_at datetime                          NOT NULL DEFAULT NOW(),
    updated_at datetime                          NOT NULL DEFAULT NOW(),
    PRIMARY KEY (`id`),
    INDEX idx_question_product (product_id),
    INDEX idx_question_user (user_id),
    INDEX idx_question_status (status),
    CONSTRAINT fk_question_product
        FOREIGN KEY (product_id)
            REFERENCES product (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT fk_question_user
        FOREIGN KEY (user_id)
            REFERENCES member (login_id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
);

CREATE TABLE answer
(
    id          INT AUTO_INCREMENT NOT NULL,
    question_id INT                NOT NULL,
    seller_id   VARCHAR(30)        NOT NULL,
    content     varchar(255)       NOT NULL,
    created_at  datetime           NOT NULL DEFAULT NOW(),
    updated_at  datetime           NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    INDEX idx_answer_question (question_id),
    INDEX idx_answer_seller (seller_id),
    CONSTRAINT fk_question_id
        FOREIGN KEY (question_id)
            REFERENCES question (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT fk_seller_id
        FOREIGN KEY (seller_id)
            REFERENCES member (login_id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
);

