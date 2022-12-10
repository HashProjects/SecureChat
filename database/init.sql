BEGIN TRANSACTION;

DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
    id CHAR(36),
    name VARCHAR UNIQUE,
    password VARCHAR,
    version INT DEFAULT 0,
    publicKey VARCHAR,
    publicKeyType VARCHAR,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS Messages;
CREATE TABLE Messages (
    id CHAR(36),
    text VARCHAR(1024),
    room_id INT,
    timestamp INT,
    user_id CHAR(36),
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS ChatRoom;
CREATE TABLE ChatRoom (
    id CHAR(36),
    name VARCHAR,
    key VARCHAR,
    iv VARCHAR,
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS ChatRoomUsers;
CREATE TABLE ChatRoomUsers (
    room_id CHAR(36),
    user_id CHAR(36),
    PRIMARY KEY(room_id, user_id)
);

COMMIT;