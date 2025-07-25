CREATE TABLE member
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    login_id VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(200)       NOT NULL,
    name     VARCHAR(50)        NOT NULL,
    phone    VARCHAR(20)        NOT NULL,
    email    VARCHAR(100)       NOT NULL,
    address  VARCHAR(255)       NOT NULL,
    birthday DATE               NOT NULL
);

DROP TABLE member;

SELECT id, login_id, password FROM member WHERE login_id = 'choi1563';  -- 로그인 기준
SELECT id, login_id, password FROM member WHERE id = 128;