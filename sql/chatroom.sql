CREATE TABLE chat_room
(

    id         INT AUTO_INCREMENT                 NOT NULL,
    user_id    VARCHAR(30)                        NOT NULL,
    admin_id   VARCHAR(30)                        NOT NULL,
    room_id    VARCHAR(36)                        NOT NULL,
    type       ENUM ('OPEN', 'CLOSED', 'DISABLE') NOT NULL,
    created_at datetime                           NOT NULL DEFAULT NOW(),
    PRIMARY KEY (`id`),
    CONSTRAINT fk_room_user
        FOREIGN KEY (user_id)
            REFERENCES member (login_id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE,
    CONSTRAINT fk_room_admin
        FOREIGN KEY (admin_id)
            REFERENCES member (login_id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
);

ALTER TABLE chat_room
    MODIFY COLUMN type ENUM ('OPEN', 'CLOSED', 'DISABLE') NOT NULL DEFAULT 'OPEN';