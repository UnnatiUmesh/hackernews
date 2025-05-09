import "dotenv/config";
import { serve } from "@hono/node-server";
import { allroutes } from "./routes/routes";



serve(allroutes, ({ port }) => {
  console.log(`\tRunning @ http://localhost:${port}`);
});