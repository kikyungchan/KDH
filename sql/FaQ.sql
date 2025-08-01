CREATE table faq
(
    id         INTEGER AUTO_INCREMENT not null,
    question   varchar(255),
    answer     varchar(255),
    user_id    VARCHAR(30)            NOT NULL,
    category   INTEGER                NOT NULL,
    created_at datetime               NOT NULL DEFAULT NOW(),
    updated_at datetime               NOT NULL DEFAULT NOW(),
    PRIMARY KEY (`id`),
    INDEX idx_faq_question (question),
    INDEX idx_faq_answer (answer),
    CONSTRAINT fk_faq_user
        FOREIGN KEY (user_id)
            REFERENCES member (login_id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
);

drop table faq