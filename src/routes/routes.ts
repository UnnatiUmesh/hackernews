import { Hono } from "hono";
import { authenticationroutes } from "./authentication-routes.js";
import { usersRoutes } from "./user-routes.js";
import { postRoutes } from "./post-routes.js";
import { likeRoutes } from "./like-routes.js";
import { commentRoutes } from "./comments-routes.js";
export const allroutes = new Hono();

allroutes.get("/health", async (context) => {
  return context.json(
    {
      message: "AllOk",
    },
    200
  );
});

allroutes.route("/auth", authenticationroutes);
allroutes.route("/users", usersRoutes);
allroutes.route("/posts", postRoutes);
allroutes.route("/likes", likeRoutes);
allroutes.route("/comments", commentRoutes);
