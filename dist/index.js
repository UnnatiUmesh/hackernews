"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const routes_js_1 = require("./routes/routes.js");
const app = new hono_1.Hono();
app.route('/', routes_js_1.allroutes);
(0, node_server_1.serve)(app, ({ port }) => {
    console.log(`\tRunning @ http://localhost:${port}`);
});
