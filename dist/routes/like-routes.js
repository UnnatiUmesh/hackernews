"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeRoutes = void 0;
const hono_1 = require("hono");
const like_controller_js_1 = require("../controllers/likes/like-controller.js");
const like_type_js_1 = require("../controllers/likes/like-type.js");
const session_middleware_js_1 = require("./middlewares/session-middleware.js");
exports.likeRoutes = new hono_1.Hono();
exports.likeRoutes.post("/on/:postId", session_middleware_js_1.sessionMiddleware, async (context) => {
    const user = context.get("user");
    const postId = await context.req.param("postId");
    try {
        const result = await (0, like_controller_js_1.likePost)({
            userId: user.id,
            postId,
        });
        return context.json(result, 200);
    }
    catch (e) {
        if (e === like_type_js_1.LikePostError.UNAUTHORIZED) {
            return context.json({
                message: "User with the token is not found",
            }, 400);
        }
        if (e === like_type_js_1.LikePostError.NOT_FOUND) {
            return context.json({
                message: "Post with given id is not found",
            }, 404);
        }
        if (e === like_type_js_1.LikePostError.ALREADY_LIKED) {
            return context.json({
                message: "The post is already liked",
            }, 400);
        }
        return context.json({
            message: "Internal server error",
        }, 500);
    }
});
exports.likeRoutes.get("/on/:postId", session_middleware_js_1.sessionMiddleware, async (context) => {
    const user = context.get("user");
    const postId = await context.req.param("postId");
    try {
        const result = await (0, like_controller_js_1.getLikePosts)({
            userId: user.id,
            postId,
        });
        return context.json(result, 200);
    }
    catch (e) {
        if (e === like_type_js_1.GetLikePostError.UNAUTHORIZED) {
            return context.json({ message: "User unauthorized" }, 400);
        }
        return context.json({ message: "Internal Server Error" }, 500);
    }
});
exports.likeRoutes.delete("/deletelike/:postId", session_middleware_js_1.sessionMiddleware, async (context) => {
    const userId = context.get("user").id;
    const postId = String(await context.req.param("postId"));
    try {
        const response = await (0, like_controller_js_1.deleteLikes)({
            userId,
            postId,
        });
        return context.json(response, 200);
    }
    catch (e) {
        if (e === like_type_js_1.DeleteLikeError.NOT_FOUND) {
            return context.json({
                message: "Post is not found",
            }, 400);
        }
        if (e === like_type_js_1.DeleteLikeError.UNAUTHORIZED) {
            return context.json({
                message: "User is not found",
            }, 400);
        }
        if (e === like_type_js_1.DeleteLikeError.LIKE_NOT_FOUND) {
            return context.json({
                message: "Like on the post is not found",
            }, 400);
        }
        return context.json({
            message: "Internal server error",
        }, 500);
    }
});
