"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const hono_1 = require("hono");
const user_controller_js_1 = require("../controllers/users/user-controller.js");
const user_types_js_1 = require("../controllers/users/user-types.js");
const session_middleware_js_1 = require("./middlewares/session-middleware.js");
exports.usersRoutes = new hono_1.Hono();
exports.usersRoutes.get("/me", session_middleware_js_1.sessionMiddleware, async (context) => {
    const userId = context.get("user").id;
    try {
        const user = await (0, user_controller_js_1.getMe)({
            userId,
        });
        return context.json({
            data: user,
        }, 200);
    }
    catch (e) {
        if (e === user_types_js_1.GetMeError.BAD_REQUEST) {
            return context.json({
                error: "User not found",
            }, 400);
        }
        return context.json({
            message: "Internal Server Error",
        }, 500);
    }
});
exports.usersRoutes.get("/getAllusers", session_middleware_js_1.sessionMiddleware, async (context) => {
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    try {
        const result = await (0, user_controller_js_1.getAllUsers)(page, limit);
        return context.json({
            data: result.users,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        }, 200);
    }
    catch (e) {
        return context.json({ message: e }, 404);
    }
});
exports.usersRoutes.get("/:userId", session_middleware_js_1.sessionMiddleware, async (context) => {
    const userId = context.req.param("userId");
    try {
        const user = await (0, user_controller_js_1.getUserById)(userId);
        return context.json({ data: user }, 200);
    }
    catch (error) {
        if (error === "USER_NOT_FOUND") {
            return context.json({ error: "User not found" }, 404);
        }
        return context.json({ message: "Internal Server Error" }, 500);
    }
});
