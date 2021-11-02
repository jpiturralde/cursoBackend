DROP SCHEMA websocketsdb;
CREATE SCHEMA websocketsdb;

USE websocketsdb;

CREATE USER coderhouse@localhost IDENTIFIED BY 'coderhouse';

GRANT ALL PRIVILEGES ON websocketsdb.* TO coderhouse@localhost identified by 'coderhouse';

FLUSH PRIVILEGES;

CREATE TABLE products(
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    price DECIMAL(13,2) NOT NULL,
    thumbnail VARCHAR(250) NOT NULL,
    primary key(id)
);

DROP TABLE messages;

CREATE TABLE messages(
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    ts BIGINT UNSIGNED NOT NULL,
    author VARCHAR(50) NOT NULL,
    msg VARCHAR(250),
    primary key(id)
);