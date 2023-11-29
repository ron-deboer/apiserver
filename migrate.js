import sqlite3 from "sqlite3";
import fs from "fs";
const db_name = "./db.sqlite3";

fs.unlink(db_name, (err => {
  if (err) {
      console.log(err);
      exit(1);
  }
  else {
    console.log("\nDeleted file: " + db_name);
    createDb();
  }
}));

async function createDb() {
    console.log("creating database...");
    const db = new sqlite3.Database(db_name, async (err) => {
        if (err) {
            console.log("Create Database Error " + err);
            exit(1);
        }
        const sql = fs.readFileSync("./migrate.sql", "utf8");
        console.log(sql);
        execute(db, sql);
        db.close();
    });
}

function execute(db, sql, params) {
    let promise = new Promise((resolve, reject) => {
        db.exec(sql);
        resolve({ status: "ok" });
    });
    return promise;
}
