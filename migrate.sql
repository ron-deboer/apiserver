    CREATE TABLE `user` (
        `id`        integer,
        `username`  varchar NOT NULL,
        `password`  varchar NOT NULL,
        `firstname` varchar,
        `lastname`  varchar,
        `phone`     varchar,
        `email`     varchar NOT NULL,
        `type`      varchar,
        `status`    varchar,
        `created_at` TIMESTAMP DEFAULT (datetime('now','localtime')),
        PRIMARY KEY(`id` AUTOINCREMENT)
    );
    CREATE INDEX idx_username ON user(username);
    INSERT INTO `user` (username, password, firstname, lastname, phone, email, type)
        values ('superuser', '', 'Super', 'User', '', 'su@email.com', 'admin');
    INSERT INTO `user` (username, password, firstname, lastname, phone, email, type)
        values ('deboerr', '123456', 'Ron', 'deBoer', '', 'deboerr@email.com', 'user');
    INSERT INTO `user` (username, password, firstname, lastname, phone, email, type)
        values ('carrid', '123456', 'Carol', 'Riddington', '', 'cr@email.com', 'user');

    CREATE TABLE `crypto` (
        `id`        integer,
        `symbol`    varchar NOT NULL,
        `name`      varchar NOT NULL,
        `date`      TIMESTAMP DEFAULT (datetime('now','localtime')),
        `price`     real,
        `price_change` real,
        `created_at` TIMESTAMP DEFAULT (datetime('now','localtime')),
        PRIMARY KEY(`id` AUTOINCREMENT)
    );
    CREATE INDEX idx_symbol_crypto ON crypto(symbol);

	CREATE TABLE `stock` (
        `id`        integer,
        `symbol`    varchar NOT NULL,
        `name`      varchar NOT NULL,
        `date`      TIMESTAMP DEFAULT (datetime('now','localtime')),
        `price`     real,
        `price_change` real,
        `created_at` TIMESTAMP DEFAULT (datetime('now','localtime')),
        PRIMARY KEY(`id` AUTOINCREMENT)
    );
    CREATE INDEX idx_symbol_stock ON stock(symbol);

	CREATE TABLE `forex` (
        `id`        integer,
        `symbol`    varchar NOT NULL,
        `name`      varchar NOT NULL,
        `date`      TIMESTAMP DEFAULT (datetime('now','localtime')),
        `price`     real,
        `price_change` real,
        `created_at` TIMESTAMP DEFAULT (datetime('now','localtime')),
        PRIMARY KEY(`id` AUTOINCREMENT)
    );
    CREATE INDEX idx_symbol_forex ON forex(symbol);
