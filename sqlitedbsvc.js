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

// generic
    async fetchAll(table) {
        const sql = `select * from ${table} order by symbol;`;
        const { err, rows } = await this.query(sql, []);
        return rows;
    }

    async fetchBySymbol(table, symbol) {
        const sql = `select * from ${table} where symbol=?;`;
        const { err, row } = await this.get(sql, [symbol]);
        if (!!row) {
            return row;
        }
        return {error: 'not found'};
    }

    async update(table, data) {
        const row = await this.fetchBySymbol(table, data.symbol);
        if (!!row.error) {
            return await this.insert(table, data)
        }
        let sql = `update ${table} set price=?, price_change=?, date=(datetime('now','localtime')) where symbol=?`;
        const { err, result } = await this.execute(sql, [
            data.price,
			data.price_change,
            data.symbol,
        ]);
        return { err, result };
    }

    async insert(table, data) {
        let sql = `insert into ${table} (symbol, name, price, price_change)
            values ('${data.symbol}', '${data.name}', ${data.price}, ${data.price_change});`;
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
