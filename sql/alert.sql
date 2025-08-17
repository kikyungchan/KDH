CREATE TABLE alert_test
(
    id         INT AUTO_INCREMENT      NOT NULL,
    user_id    VARCHAR(30)             NOT NULL,
    title      VARCHAR(50)             NOT NULL,
    content    varchar(255)            NOT NULL,
    status     ENUM ('open','checked') NOT NULL DEFAULT 'open',
    created_at datetime                NOT NULL DEFAULT NOW(),
    updated_at datetime                NOT NULL DEFAULT NOW(),
    PRIMARY KEY (`id`),
    INDEX idx_alert2_user (user_id),
    INDEX idx_alert2_status (status),
    CONSTRAINT fk_alert2_user
        FOREIGN KEY (user_id)
            REFERENCES member (login_id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
);

insert into alert (id, user_id, title, content)
values (1, 'admin1', 'tit', 'content');


ALTER TABLE alert
    ADD requester_id varchar(30) NOT NULL;

alter table alert
    add constraint fk_alert_requester
        foreign key (requester_id) references member (login_id)
            on update cascade;

ALTER TABLE alert
    ADD CONSTRAINT fk_alert_requester
        FOREIGN KEY (requester_id) REFERENCES member (login_id)
            ON UPDATE CASCADE;

