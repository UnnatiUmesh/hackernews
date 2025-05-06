"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoutes = void 0;
const hono_1 = require("hono");
const comment_controller_js_1 = require("../controllers/comments/comment-controller.js");
const comment_types_js_1 = require("../controllers/comments/comment-types.js");
const session_middleware_js_1 = require("./middlewares/session-middleware.js");
exports.commentRoutes = new hono_1.Hono();
exports.commentRoutes.post("/on/:postId", session_middleware_js_1.sessionMiddleware, async (context) => {
    const user = context.get("user");
    const postId = await context.req.param("postId");
    const { content } = await context.req.json();
    if (!user || !user.id) {
        return context.json({ message: "Unauthorized: session not found or expired" }, 401);
    }
    try {
        const result = await (0, comment_controller_js_1.commentPost)({
            userId: user.id,
            postId,
            content,
        });
        return context.json(result, 200);
    }
    catch (e) {
        if (e === comment_types_js_1.CommentPostError.UNAUTHORIZED) {
            return context.json({ message: "User with the token is not found" }, 400);
        }
        if (e === comment_types_js_1.CommentPostError.NOT_FOUND) {
            return context.json({ message: "Post with given id is not found" }, 404);
        }
        console.error("Internal error in commentPost:", e); // 🔍 useful!
        return context.json({ message: "Internal server error" }, 500);
    }
});
exports.commentRoutes.get("/on/:postId", session_middleware_js_1.sessionMiddleware, async (context) => {
    const user = context.get("user");
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    const postId = await context.req.param("postId");
    try {
        const result = await (0, comment_controller_js_1.getCommentPosts)({
            userId: user.id,
            postId,
            page,
            limit,
        });
        return context.json({
            data: result.comments,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        }, 200);
    }
    catch (e) {
        if (e === comment_types_js_1.GetCommentPostError.UNAUTHORIZED) {
            return context.json({
                message: "User with the given token is not present",
            }, 400);
        }
        if (e === comment_types_js_1.GetCommentPostError.BAD_REQUEST) {
            return context.json({
                error: "There is no comments for this post",
            }, 400);
        }
        return context.json({
            message: "Internal Server Error",
        }, 500);
    }
});
exports.commentRoutes.delete("/:commentId", session_middleware_js_1.sessionMiddleware, async (context) => {
    const userId = context.get("user").id;
    const commentId = String(await context.req.param("commentId"));
    try {
        const result = await (0, comment_controller_js_1.deleteComment)({
            userId,
            commentId,
        });
        return context.json(result, 200);
    }
    catch (e) {
        if (e === comment_types_js_1.DeleteCommentError.UNAUTHORIZED) {
            return context.json({
                message: "User with the token does not exists",
            }, 400);
        }
        if (e === comment_types_js_1.DeleteCommentError.NOT_FOUND) {
            return context.json({
                message: "Comment with given id not found",
            }, 404);
        }
        return context.json({
            message: "Internal Server error",
        }, 500);
    }
});
exports.commentRoutes.patch("/:commentId", session_middleware_js_1.sessionMiddleware, async (context) => {
    const userId = context.get("user").id;
    const commentId = String(await context.req.param("commentId"));
    const { content } = await context.req.json();
    try {
        const result = await (0, comment_controller_js_1.updateCommentById)({
            userId,
            commentId,
            content,
        });
        return context.json(result, 200);
    }
    catch (e) {
        if (e === comment_types_js_1.UpdateCommetError.UNAUTHORIZED) {
            return context.json({
                message: "User with given token is not found",
            }, 400);
        }
        if (e === comment_types_js_1.UpdateCommetError.NOT_FOUND) {
            return context.json({
                message: "Comment with given id not found",
            }, 400);
        }
        return context.json({
            message: "Internal server error",
        }, 500);
    }
});
exports.commentRoutes.get("/all", session_middleware_js_1.sessionMiddleware, async (context) => {
    const user = context.get("user");
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    try {
        const result = await (0, comment_controller_js_1.getAllComments)({
            userId: user.id,
            page,
            limit,
        });
        return context.json({
            data: result.comments,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        }, 200);
    }
    catch (e) {
        if (e === comment_types_js_1.GetCommentPostError.UNAUTHORIZED) {
            return context.json({ message: "Unauthorized" }, 401);
        }
        if (e === comment_types_js_1.GetCommentPostError.BAD_REQUEST) {
            return context.json({ message: "No comments found" }, 400);
        }
        return context.json({ message: "Internal Server Error" }, 500);
    }
});
exports.commentRoutes.get("/byUser/:userId", session_middleware_js_1.sessionMiddleware, async (context) => {
    const userId = context.req.param("userId");
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    try {
        const result = await (0, comment_controller_js_1.getCommentsByUser)({
            userId,
            page,
            limit,
        });
        return context.json({
            data: result.comments,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        }, 200);
    }
    catch (e) {
        return context.json({ message: "Internal Server Error" }, 500);
    }
});
