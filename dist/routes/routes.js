"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allroutes = void 0;
const hono_1 = require("hono");
const user_routes_js_1 = require("./user-routes.js");
const post_routes_js_1 = require("./post-routes.js");
const like_routes_js_1 = require("./like-routes.js");
const comments_routes_js_1 = require("./comments-routes.js");
const cors_1 = require("hono/cors");
const session_middleware_js_1 = require("./middlewares/session-middleware.js");
exports.allroutes = new hono_1.Hono();
exports.allroutes.use((0, cors_1.cors)({
    origin: "http://localhost:4000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
}));
exports.allroutes.get("/health", async (context) => {
    return context.json({
        message: "AllOk",
    }, 200);
});
exports.allroutes.route("/api/auth", session_middleware_js_1.authRoute);
exports.allroutes.route("/users", user_routes_js_1.usersRoutes);
exports.allroutes.route("/posts", post_routes_js_1.postRoutes);
exports.allroutes.route("/likes", like_routes_js_1.likeRoutes);
exports.allroutes.route("/comments", comments_routes_js_1.commentRoutes);
