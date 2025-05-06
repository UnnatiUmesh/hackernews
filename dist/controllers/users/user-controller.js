"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getAllUsers = exports.getMe = void 0;
const prisma_js_1 = require("../../extras/prisma.js");
const user_types_js_1 = require("./user-types.js");
const getMe = async (parameters) => {
    const user = await prisma_js_1.prismaClient.user.findUnique({
        where: {
            id: parameters.userId,
        },
        select: {
            id: true,
            username: true,
            displayUsername: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            email: true,
            emailVerified: true,
            image: true,
        }
    });
    if (!user) {
        throw user_types_js_1.GetMeError.BAD_REQUEST;
    }
    return {
        user,
    };
};
exports.getMe = getMe;
const getAllUsers = async (page = 1, limit = 10) => {
    const users = await prisma_js_1.prismaClient.user.findMany({
        orderBy: {
            name: "asc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    if (!users) {
        throw user_types_js_1.usersError.BAD_REQUEST;
    }
    const totalUsers = await prisma_js_1.prismaClient.user.count();
    return {
        users,
        total: totalUsers,
    };
};
exports.getAllUsers = getAllUsers;
const getUserById = async (userId) => {
    const user = await prisma_js_1.prismaClient.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            createdAt: true,
        },
    });
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    return user;
};
exports.getUserById = getUserById;
