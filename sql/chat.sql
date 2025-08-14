CREATE TABLE chat_log
(
    id         INT AUTO_INCREMENT              NOT NULL,
    user_id    VARCHAR(30)                     NOT NULL,
    room_id    VARCHAR(36)                     NOT NULL,
    message    varchar(255)                    NOT NULL,
    type       ENUM ('ENTER', 'CHAT', 'LEAVE') NOT NULL,
    created_at datetime                        NOT NULL DEFAULT NOW(),
    PRIMARY KEY (`id`),
    INDEX idx_chat_user (user_id),
    INDEX idx_chat_message (message),
    CONSTRAINT fk_chat_user
        FOREIGN KEY (user_id)
            REFERENCES member (login_id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
);


SELECT c.id,
       m.login_id,
       c.message
FROM chat_log c
         JOIN member m
              ON c.user_id = m.login_id
where room_id = "b300c649-d1b6-46a7-8021-afc838f807ef"
ORDER BY c.id DESC;
