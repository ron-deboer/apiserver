import sqlite3 from "sqlite3";
const db_name = "./db.sqlite3";

class SqliteDbSvc {
    constructor() {
        const self = this;
        this.db = new sqlite3.Database(db_name, sqlite3.OPEN_READWRITE, (err) => {
            if (err !== null) {
                console.log("Open Database Error " + err);
            }
        });
    }

// crypto
    async fetchAllCrypto() {
        const sql = `select * from crypto order by symbol;`;
        const { err, rows } = await this.query(sql, []);
        return rows;
    }

    async fetchCryptoBySymbol(symbol) {
        const sql = "select * from crypto where symbol=?;";
        const { err, row } = await this.get(sql, [symbol]);
        if (!!row) {
            return row;
        }
        return {error: 'not found'};
    }

    async updateCrypto(crypto) {
        const row = await this.fetchCryptoBySymbol(crypto.symbol);
        if (!!row.error) {
            return await this.insertCrypto(crypto)
        }
        let sql = `update crypto set price=?, price_change=?, date=(datetime('now','localtime')) where symbol=?`;
        const { err, result } = await this.execute(sql, [
            crypto.price,
			crypto.price_change,
            crypto.symbol,
        ]);
        return { err, result };
    }

    async insertCrypto(crypto) {
        let sql = `insert into crypto (symbol, name, price, price_change)
            values ('${crypto.symbol}', '${crypto.name}', ${crypto.price}, ${crypto.price_change});`;
        const { err, result } = await this.execute(sql);
        return { err, result };
    }

// stock
    async fetchAllStock() {
        const sql = `select * from stock order by symbol;`;
        const { err, rows } = await this.query(sql, []);
        return rows;
    }

    async fetchStockBySymbol(symbol) {
        const sql = "select * from stock where symbol=?;";
        const { err, row } = await this.get(sql, [symbol]);
        if (!!row) {
            return row;
        }
        return {error: 'not found'};
    }

    async updateStock(stock) {
        const row = await this.fetchStockBySymbol(stock.symbol);
        if (!!row.error) {
            return await this.insertStock(stock)
        }
        let sql = `update stock set price=?, price_change=?, date=(datetime('now','localtime')) where symbol=?`;
        const { err, result } = await this.execute(sql, [
            stock.price,
			stock.price_change,
            stock.symbol,
        ]);
        return { err, result };
    }

    async insertStock(stock) {
        let sql = `insert into stock (symbol, name, price, price_change)
            values ('${stock.symbol}', '${stock.name}', ${stock.price}, ${stock.price_change});`;
        const { err, result } = await this.execute(sql);
        return { err, result };
    }

// forex
    async fetchAllForex() {
        const sql = `select * from forex order by symbol;`;
        const { err, rows } = await this.query(sql, []);
        return rows;
    }

    async fetchForexBySymbol(symbol) {
        const sql = "select * from forex where symbol=?;";
        const { err, row } = await this.get(sql, [symbol]);
        if (!!row) {
            return row;
        }
        return {error: 'not found'};
    }

    async updateForex(forex) {
        const row = await this.fetchForexBySymbol(forex.symbol);
        if (!!row.error) {
            return await this.insertForex(forex)
        }
        let sql = `update forex set price=?, price_change=?, date=(datetime('now','localtime')) where symbol=?`;
        const { err, result } = await this.execute(sql, [
            forex.price,
			forex.price_change,
            forex.symbol,
        ]);
        return { err, result };
    }

    async insertForex(forex) {
        let sql = `insert into forex (symbol, name, price, price_change)
            values ('${forex.symbol}', '${forex.name}', ${forex.price}, ${forex.price_change});`;
        const { err, result } = await this.execute(sql);
        return { err, result };
    }
// users
    async fetchAllUsers() {
        const sql = `select * from user order by created_at desc;`;
        const { err, rows } = await this.query(sql, []);
        return rows.map((u) => this.omitPassword(u));
    }

    async fetchUserByLogin(userid, password) {
        const sql = `select * from user where username=? and password=?;`;
        const { err, row } = await this.get(sql, [userid, password]);
        if (!!row) {
            return [row].map((u) => this.omitPassword(u));
        }
        return {error: 'not found'};
    }

    async fetchUserById(id) {
        const sql = `select * from user where id=?;`;
        const { err, row } = await this.get(sql, [id]);
        if (!!row) {
            return [row].map((u) => this.omitPassword(u));
        }
        return {error: 'not found'};
    }

    async insertUser(user) {
        let sql = `insert into user (username, password, phone, email, firstname, lastname, type)
            values ('${user.username}', '${user.password}', '${user.phone}', '${user.email}', '${user.firstname}', '${user.lastname}', '${user.type}');`;
        const { err, result } = await this.execute(sql);
        return { err, result };
    }

    async deleteUser(id) {
        const { err, result } = await this.execute("delete from user where id = ?", [id]);
        return { err, result };
    }

    async updateUser(id, user) {
        let sql = `update user set username=?, firstname=?, lastname=?, email=?, phone=? where id=?`;
        const { err, result } = await this.execute(sql, [
            user.username,
            user.firstname,
            user.lastname,
            user.email,
            user.phone,
            id,
        ]);
        return { err, result };
    }

    omitPassword(user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async execute(sql, params) {
        let promise = new Promise(async (resolve, reject) => {
            await this.db.run(sql, params, (err) => {
                if (err) {
                    console.log(err.message);
                }
                resolve({ err });
            });
        });
        return promise;
    }

    async query(sql, params) {
        let promise = new Promise(async (resolve, reject) => {
            await this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log(err.message);
                }
                resolve({ err, rows });
            });
        });
        return promise;
    }

    async get(sql, params) {
        let promise = new Promise(async (resolve, reject) => {
            await this.db.get(sql, params, (err, row) => {
                if (err) {
                    console.log(err.message);
                }
                resolve({ err, row });
            });
        });
        return promise;
    }
}

export default new SqliteDbSvc();
