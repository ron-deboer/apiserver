import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dbservice from "./sqlitedbsvc.js";

//---------------------------------------------------------------
// http api server
//---------------------------------------------------------------
export default class HTTPServer {
    constructor(port) {
        this.clients = [];

        const app = express();
        app.use(cors());
        app.use(bodyParser.json());

// generic
        app.put("/api/:table", async (req, res, next) => {
            const start = new Date();
            const result = await dbservice.update(req.params.table, req.body);
            res.status(200).json(result);
            console.log("%s %s %d %dms", req.method, req.url, res.statusCode, new Date() - start);
            this.notifyclients({ action: "DB_UPDATE" });
            next();
        });

        app.get("/api/:table", async (req, res, next) => {
            const start = new Date();
            const data = await dbservice.fetchAll(req.params.table);
            res.status(200).json(data);
            console.log("%s %s %d %dms", req.method, req.url, res.statusCode, new Date() - start);
            next();
        });

// user
        app.post("/api/login", async (req, res, next) => {
            const start = new Date();
            // console.log(req.body.userid, req.body.password);
            const result = await dbservice.fetchUserByLogin(req.body.userid, req.body.password)
            res.status(200).json(result);
            console.log("%s %s %d %dms", req.method, req.url, res.statusCode, new Date() - start);
            next();
        });

        app.get("/api/users", async (req, res, next) => {
            const start = new Date();
            const data = await dbservice.fetchAllUsers();
            res.status(200).json(data);
            console.log("%s %s %d %dms", req.method, req.url, res.statusCode, new Date() - start);
            next();
        });

        app.get("/api/users/:id", async (req, res, next) => {
            const start = new Date();
            const user = await dbservice.fetchUserById(req.params.id);
            res.status(200).json(user);
            console.log("%s %s %d %dms", req.method, req.url, res.statusCode, new Date() - start);
            next();
        });

        app.post("/api/users", async (req, res, next) => {
            const start = new Date();
            const result = await dbservice.insertUser(req.body);
            res.status(200).json(result);
            console.log("%s %s %d %dms", req.method, req.url, res.statusCode, new Date() - start);
            this.notifyclients({ action: "DB_INSERT" });
            next();
        });

        app.put("/api/users", async (req, res, next) => {
            const start = new Date();
            const result = await dbservice.updateUser(req.body);
            res.status(200).json(result);
            console.log("%s %s %d %dms", req.method, req.url, res.statusCode, new Date() - start);
            this.notifyclients({ action: "DB_UPDATE" });
            next();
        });

        app.delete("/api/users/:id", async (req, res, next) => {
            const start = new Date();
            const result = await dbservice.deleteUser(req.params.id);
            res.status(200).json(result);
            console.log("%s %s %d %dms", req.method, req.url, res.statusCode, new Date() - start);
            this.notifyclients({ action: "DB_DELETE" });
            next();
        });

        app.get("/api/stream", async (req, res, next) => {
            const start = new Date();
            res.writeHead(200, {
                "Content-Type": "text/event-stream",
                Connection: "keep-alive",
                "Cache-Control": "no-cache",
            });
            console.log("%s %s %d %dms", req.method, req.url, res.statusCode, new Date() - start);
            // keep track of listening clients
            const clientId = Date.now();
            const newClient = {
                id: clientId,
                response: res,
            };
            this.clients.push(newClient);
            console.log(`${clientId} Connection opened`);
            // client closed
            res.on("close", () => {
                console.log(`${clientId} Connection closed`);
                this.clients = this.clients.filter((client) => client.id !== clientId);
            });
            next();
        });

        app.listen(port);
        console.log("http server listening on port %d", port);
    }

    // push message to all clients
    notifyclients(msg) {
        this.clients.forEach((client) => {
            client.response.write(`data: ${JSON.stringify(msg)}\n\n`);
        });
    }
}
