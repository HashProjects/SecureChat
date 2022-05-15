BEGIN TRANSACTION;

DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id CHAR(36),
    username VARCHAR UNIQUE,
    password VARCHAR,
    version INT DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE Message (
    id CHAR(36),
    text VARCHAR(1024),
    room_id INT,
    timestamp INT,
    user_id CHAR(36),
    PRIMARY KEY(id)
);

CREATE TABLE ChatRoom (
    id CHAR(36),
    users CHAR(360),
    key VARCHAR,
    PRIMARY KEY(id)
);

COMMIT;