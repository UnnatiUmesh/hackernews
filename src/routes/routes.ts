import { Hono } from "hono";
import { usersRoutes } from "./user-routes.js";
import { postRoutes } from "./post-routes.js";
import { likeRoutes } from "./like-routes.js";
import { commentRoutes } from "./comments-routes.js";
import { cors } from "hono/cors";
import { authRoute } from "./middlewares/session-middleware.js";
import { logger } from "hono/logger";
import { webClientUrl } from "../environment.js";
export const allroutes = new Hono();
allroutes.use(
  "*",
  cors({
    origin: webClientUrl, 
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Global logger
allroutes.use(logger());
allroutes.get("/health", async (context) => {
  return context.json(
    {
      message: "AllOk",
    },
    200
  );
});


allroutes.route("/api/auth", authRoute);
allroutes.route("/users", usersRoutes);
allroutes.route("/posts", postRoutes);
allroutes.route("/likes", likeRoutes);
allroutes.route("/comments", commentRoutes);


