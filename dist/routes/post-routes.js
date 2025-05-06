"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const hono_1 = require("hono");
const post_controller_js_1 = require("../controllers/posts/post-controller.js");
const post_types_js_1 = require("../controllers/posts/post-types.js");
const session_middleware_js_1 = require("./middlewares/session-middleware.js");
exports.postRoutes = new hono_1.Hono();
exports.postRoutes.post("/create-post", session_middleware_js_1.sessionMiddleware, async (context) => {
    const user = context.get("user");
    const input = await context.req.json();
    try {
        const result = await (0, post_controller_js_1.createPost)({
            userId: user.id,
            input,
        });
        return context.json({ data: result }, 200);
    }
    catch (e) {
        if (e === post_types_js_1.CreatePostError.BAD_REQUEST) {
            return context.json({ message: "Title and content are required" }, 400);
        }
        if (e === post_types_js_1.CreatePostError.UNAUTHORIZED) {
            return context.json({ message: "User is not authorized" }, 401);
        }
        return context.json({ message: "Internal Server Error" }, 500);
    }
});
exports.postRoutes.delete("/deletepost/:postId", session_middleware_js_1.sessionMiddleware, async (context) => {
    const userId = context.get("user").id;
    const postId = String(await context.req.param("postId"));
    try {
        const response = await (0, post_controller_js_1.deletePost)({
            userId,
            postId,
        });
        console.log(response);
        return context.json(response, 200);
    }
    catch (e) {
        if (e === post_types_js_1.DeletePostError.NOT_FOUND) {
            return context.json({
                message: "Post is not found",
            }, 400);
        }
        if (e === post_types_js_1.DeletePostError.UNAUTHORIZED) {
            return context.json({
                message: "User is not found",
            }, 400);
        }
        return context.json({
            message: "Internal server error",
        }, 500);
    }
});
//added get post by id function
exports.postRoutes.get("/getpost/:postId", session_middleware_js_1.sessionMiddleware, async (context) => {
    const postId = String(await context.req.param("postId"));
    try {
        const result = await (0, post_controller_js_1.getPostById)(postId);
        return context.json({
            data: result,
        }, 200);
    }
    catch (e) {
        if (e === post_types_js_1.GetPostError.BAD_REQUEST) {
            return context.json({
                message: "Post with given id does not exist",
            }, 400);
        }
        return context.json({
            message: "Internal Server Error",
        }, 500);
    }
});
exports.postRoutes.get("/pastposts", session_middleware_js_1.sessionMiddleware, async (context) => {
    const before = context.req.query("before") ?? new Date().toISOString();
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    try {
        const result = await (0, post_controller_js_1.getPastPosts)(before, page, limit);
        return context.json({
            data: result.posts,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        }, 200);
    }
    catch (e) {
        console.error(e);
        return context.json({ message: "Internal server error" }, 500);
    }
});
exports.postRoutes.get("/getAllposts", session_middleware_js_1.sessionMiddleware, async (context) => {
    const user = context.get("user");
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    try {
        const result = await (0, post_controller_js_1.getAllPosts)(user.id, page, limit);
        return context.json({
            data: result.posts,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        }, 200);
    }
    catch (e) {
        console.error(e);
        return context.json({ message: "Internal Server Error" }, 500);
    }
});
exports.postRoutes.get("/byUser/:userId", session_middleware_js_1.sessionMiddleware, async (context) => {
    const userId = context.req.param("userId");
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    try {
        const result = await (0, post_controller_js_1.getPostsByUser)({
            userId,
            page,
            limit,
        });
        return context.json({
            data: result.posts,
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
exports.postRoutes.get("/search", session_middleware_js_1.sessionMiddleware, async (context) => {
    const keyword = context.req.query("q") || "";
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    try {
        const result = await (0, post_controller_js_1.searchPosts)({
            keyword,
            page,
            limit,
        });
        return context.json({
            data: result.posts,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        }, 200);
    }
    catch (e) {
        console.error("Search failed:", e);
        return context.json({ message: "Internal Server Error" }, 500);
    }
});
