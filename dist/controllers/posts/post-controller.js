"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPosts = exports.getPostsByUser = exports.getAllPosts = exports.getPastPosts = exports.getPostById = exports.deletePost = exports.getMePost = exports.createPost = void 0;
const prisma_js_1 = require("../../extras/prisma.js");
const user_types_js_1 = require("../users/user-types.js");
const post_types_js_1 = require("./post-types.js");
const createPost = async (parameters) => {
    const { userId, input } = parameters;
    if (!input.title || !input.content) {
        throw post_types_js_1.CreatePostError.BAD_REQUEST;
    }
    const post = await prisma_js_1.prismaClient.post.create({
        data: {
            title: input.title,
            content: input.content,
            userId,
        },
    });
    return { post };
};
exports.createPost = createPost;
const getMePost = async (parameters) => {
    const posts = await prisma_js_1.prismaClient.post.findMany({
        where: {
            userId: parameters.userId,
        },
        orderBy: {
            createdAt: "asc",
        },
        skip: (parameters.page - 1) * parameters.limit,
        take: parameters.limit,
    });
    if (!posts) {
        throw post_types_js_1.GetMePostError.BAD_REQUEST;
    }
    const totalPosts = await prisma_js_1.prismaClient.post.count();
    return {
        posts,
        total: totalPosts,
    };
};
exports.getMePost = getMePost;
const deletePost = async (parameters) => {
    const user = await prisma_js_1.prismaClient.user.findUnique({
        where: {
            id: parameters.userId,
        },
        select: {
            id: true
        }
    });
    console.log(user);
    if (!user) {
        throw post_types_js_1.DeletePostError.UNAUTHORIZED;
    }
    const post = await prisma_js_1.prismaClient.post.findUnique({
        where: {
            id: parameters.postId,
        },
    });
    console.log(post);
    if (!post) {
        return post_types_js_1.DeletePostError.NOT_FOUND;
    }
    if (post.userId !== user.id) {
        throw new Error("Unauthorized");
    }
    try {
        await prisma_js_1.prismaClient.post.delete({
            where: { id: parameters.postId },
        });
    }
    catch (err) {
        console.error("Prisma delete error:", err);
        throw new Error("Failed to delete post");
    }
};
exports.deletePost = deletePost;
const getPostById = async (postId) => {
    const post = await prisma_js_1.prismaClient.post.findUnique({
        where: {
            id: postId,
        },
    });
    if (!post) {
        throw user_types_js_1.GetMeError.BAD_REQUEST;
    }
    return post;
};
exports.getPostById = getPostById;
const getPastPosts = async (before, page = 1, limit = 10) => {
    const beforeDate = new Date(before);
    const posts = await prisma_js_1.prismaClient.post.findMany({
        where: {
            createdAt: {
                lt: beforeDate,
            },
        },
        orderBy: {
            createdAt: "asc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    const totalPosts = await prisma_js_1.prismaClient.post.count({
        where: {
            createdAt: {
                lt: beforeDate,
            },
        },
    });
    return {
        posts,
        total: totalPosts,
    };
};
exports.getPastPosts = getPastPosts;
const getAllPosts = async (userId, page = 1, limit = 10) => {
    const posts = await prisma_js_1.prismaClient.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                }
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                },
            },
            likes: {
                where: {
                    userId: userId,
                },
                select: {
                    id: true,
                },
            },
        },
    });
    const totalPosts = await prisma_js_1.prismaClient.post.count();
    const formattedPosts = posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        likes: post._count.likes,
        commentsCount: post._count.comments,
        likedByUser: post.likes.length > 0,
        userId: post.user.id,
        username: post.user.username,
    }));
    return {
        posts: formattedPosts,
        total: totalPosts,
    };
};
exports.getAllPosts = getAllPosts;
const getPostsByUser = async (parameters) => {
    const posts = await prisma_js_1.prismaClient.post.findMany({
        where: { userId: parameters.userId },
        orderBy: { createdAt: "desc" },
        skip: (parameters.page - 1) * parameters.limit,
        take: parameters.limit,
    });
    const totalPosts = await prisma_js_1.prismaClient.post.count({
        where: { userId: parameters.userId },
    });
    return {
        posts,
        total: totalPosts,
    };
};
exports.getPostsByUser = getPostsByUser;
const searchPosts = async ({ keyword, page, limit }) => {
    const posts = await prisma_js_1.prismaClient.post.findMany({
        where: {
            title: {
                contains: keyword,
                mode: "insensitive",
            },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
    });
    const total = await prisma_js_1.prismaClient.post.count({
        where: {
            title: {
                contains: keyword,
                mode: "insensitive",
            },
        },
    });
    return {
        posts,
        total,
    };
};
exports.searchPosts = searchPosts;
