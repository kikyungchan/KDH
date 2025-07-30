CREATE table faq
(
    id         INTEGER AUTO_INCREMENT not null,
    question   varchar(255),
    answer     varchar(255),
    category   INTEGER                NOT NULL,
    created_at datetime               NOT NULL DEFAULT NOW(),
    updated_at datetime               NOT NULL DEFAULT NOW(),
    PRIMARY KEY (`id`),
    INDEX idx_faq_question (question),
    INDEX idx_faq_answer (answer)
)