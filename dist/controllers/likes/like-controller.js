"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLikes = exports.getLikePosts = exports.likePost = void 0;
const prisma_js_1 = require("../../extras/prisma.js");
const like_type_js_1 = require("./like-type.js");
const likePost = async (parameters) => {
    const { userId, postId } = parameters;
    const existuser = await prisma_js_1.prismaClient.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
        }
    });
    if (!existuser)
        throw like_type_js_1.LikePostError.UNAUTHORIZED;
    const post = await prisma_js_1.prismaClient.post.findUnique({ where: { id: postId } });
    if (!post)
        throw like_type_js_1.LikePostError.NOT_FOUND;
    const alreadyliked = await prisma_js_1.prismaClient.like.findFirst({
        where: { userId, postId },
    });
    if (alreadyliked)
        throw like_type_js_1.LikePostError.ALREADY_LIKED;
    try {
        const like = await prisma_js_1.prismaClient.like.create({
            data: {
                userId,
                postId
            },
        });
        return { like };
    }
    catch (error) {
        console.error("Error creating like:", error);
        throw like_type_js_1.LikePostError;
    }
};
exports.likePost = likePost;
const getLikePosts = async (parameters) => {
    const user = await prisma_js_1.prismaClient.user.findUnique({ where: { id: parameters.userId }, select: {
            id: true,
        } });
    if (!user)
        throw like_type_js_1.GetLikePostError.UNAUTHORIZED;
    const total = await prisma_js_1.prismaClient.like.count({ where: { postId: parameters.postId } });
    const alreadyLiked = !!(await prisma_js_1.prismaClient.like.findFirst({
        where: {
            userId: parameters.userId,
            postId: parameters.postId,
        },
    }));
    return {
        total,
        alreadyLiked,
    };
};
exports.getLikePosts = getLikePosts;
const deleteLikes = async (parameters) => {
    const user = await prisma_js_1.prismaClient.user.findUnique({
        where: {
            id: parameters.userId,
        },
        select: {
            id: true,
        }
    });
    if (!user) {
        throw like_type_js_1.DeleteLikeError.UNAUTHORIZED;
    }
    const post = await prisma_js_1.prismaClient.post.findUnique({
        where: {
            id: parameters.postId,
        },
    });
    if (!post) {
        return like_type_js_1.DeleteLikeError.NOT_FOUND;
    }
    const existinglike = await prisma_js_1.prismaClient.like.findFirst({
        where: {
            userId: parameters.userId,
            postId: parameters.postId,
        },
    });
    if (!existinglike) {
        throw like_type_js_1.DeleteLikeError.LIKE_NOT_FOUND;
    }
    await prisma_js_1.prismaClient.like.delete({
        where: {
            id: existinglike.id,
        },
    });
    return {
        message: "Like on the given post deleted suceesfully",
    };
};
exports.deleteLikes = deleteLikes;
