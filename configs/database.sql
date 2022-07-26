CREATE DATABASE "MurkaGames"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Russian_Russia.1251'
    LC_CTYPE = 'Russian_Russia.1251'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

CREATE TABLE replenish(
    id int not null,
    from_id int not null,
    amount int not null,
    payload int not null
);


CREATE TABLE settings(
    newsender boolean NOT NULL,
    bonusId int,
    bonus int,
    active boolean not null
);


CREATE TABLE conversation(
    id int NOT NULL unique,
    name text,
    owner text NOT NULL,
    type boolean NOT NULL,
    gamemode text,
    time int NOT NULL,
    hash text,
    secret text,
    result int DEFAULT NULL,
    result_text text DEFAULT NULL,
    procent int,
    win BIGINT NOT NULL,
    state_timer int NOT NULL,
    official boolean NOT NULL
);


CREATE TABLE bets(
    gameId int not null,
    playerId int not null,
    type text not null,
    amount BIGINT not null
);


CREATE TABLE users(
    id serial PRIMARY KEY,
    uid int not null unique,
    name varchar(100) not null,
    balance BIGINT not null DEFAULT 0,
    bbalance BIGINT not null DEFAULT 0,
    win BIGINT not null DEFAULT 0,
    winClock BIGINT not null DEFAULT 0,
    winDay BIGINT not null DEFAULT 0,
    winWeek BIGINT not null DEFAULT 0,
    ref int null,
    referalbonus BIGINT ARRAY,
    last_repost_id smallint,
    button_bets int NOT NULL,
    callback_button int NOT NULL,
    click_nickname int NOT NULL
);