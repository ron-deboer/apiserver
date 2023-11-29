import HTTPServer from "./httpserver.js";
import CronServer from "./cronserver.js";

const cronSrv = new CronServer();

const httpSrv = new HTTPServer(3000);
