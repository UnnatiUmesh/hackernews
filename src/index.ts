import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { allroutes } from "./routes/routes.js";

const app = new Hono();

app.route('/',allroutes);
serve(app, ({ port }) => {
  console.log(`\tRunning @ http://localhost:${port}`);
});