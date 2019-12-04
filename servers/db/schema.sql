create table if not exists users (
    id int not null auto_increment primary key,
    email varchar(255) not null unique,
    user_name varchar(255) not null unique,
    pass_hash binary(60) not null,
    first_name varchar(128) not null,
    last_name varchar(128) not null,
    photo_url varchar(255) not null
);

create table if not exists logins (
    id int not null auto_increment primary key,
    user_id int not null,
    login_time DATETIME not null,
    request_addr varchar(256) not null,
    FOREIGN KEY (user_id) REFERENCES users(id)
);