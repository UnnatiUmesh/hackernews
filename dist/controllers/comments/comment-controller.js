"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsByUser = exports.getAllComments = exports.updateCommentById = exports.deleteComment = exports.getCommentPosts = exports.commentPost = void 0;
const prisma_1 = require("../../extras/prisma");
const comment_types_1 = require("./comment-types");
const commentPost = async (parameters) => {
    const { userId, postId, content } = parameters;
    const existuser = await prisma_1.prismaClient.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
        },
    });
    if (!existuser)
        throw comment_types_1.CommentPostError.UNAUTHORIZED;
    const post = await prisma_1.prismaClient.post.findUnique({
        where: {
            id: postId,
        },
    });
    if (!post)
        throw comment_types_1.CommentPostError.NOT_FOUND;
    const result = await prisma_1.prismaClient.comment.create({
        data: {
            content,
            userId,
            postId,
        },
    });
    return {
        comment: result,
    };
};
exports.commentPost = commentPost;
const getCommentPosts = async (parameters) => {
    const user = await prisma_1.prismaClient.user.findUnique({
        where: {
            id: parameters.userId,
        },
        select: {
            id: true,
        },
    });
    if (!user) {
        throw comment_types_1.GetCommentPostError.UNAUTHORIZED;
    }
    const comments = await prisma_1.prismaClient.comment.findMany({
        where: {
            postId: parameters.postId,
        },
        orderBy: {
            createdAt: "asc",
        },
        skip: (parameters.page - 1) * parameters.limit,
        take: parameters.limit,
    });
    if (!comments) {
        throw comment_types_1.GetCommentPostError.BAD_REQUEST;
    }
    const totalcomments = await prisma_1.prismaClient.comment.count();
    return {
        comments,
        total: totalcomments,
    };
};
exports.getCommentPosts = getCommentPosts;
const deleteComment = async (parameters) => {
    const user = await prisma_1.prismaClient.user.findUnique({
        where: {
            id: parameters.userId,
        },
        select: {
            id: true,
        }
    });
    if (!user) {
        throw comment_types_1.DeleteCommentError.UNAUTHORIZED;
    }
    const comment = await prisma_1.prismaClient.comment.findUnique({
        where: {
            id: parameters.commentId,
        },
    });
    if (!comment) {
        throw comment_types_1.DeleteCommentError.NOT_FOUND;
    }
    await prisma_1.prismaClient.comment.delete({
        where: {
            id: parameters.commentId,
        },
    });
    return {
        message: "Comment deleted successfully!!!",
    };
};
exports.deleteComment = deleteComment;
const updateCommentById = async (parameters) => {
    const user = await prisma_1.prismaClient.user.findUnique({
        where: {
            id: parameters.userId,
        },
        select: {
            id: true,
        }
    });
    if (!user) {
        throw comment_types_1.UpdateCommetError.UNAUTHORIZED;
    }
    const comment = await prisma_1.prismaClient.comment.findUnique({
        where: {
            id: parameters.commentId,
        },
    });
    if (!comment) {
        throw comment_types_1.UpdateCommetError.NOT_FOUND;
    }
    const result = await prisma_1.prismaClient.comment.update({
        where: {
            id: parameters.commentId,
        },
        data: {
            content: parameters.content,
        },
    });
    return {
        comment: result,
    };
};
exports.updateCommentById = updateCommentById;
const getAllComments = async (parameters) => {
    const user = await prisma_1.prismaClient.user.findUnique({
        where: { id: parameters.userId },
        select: { id: true },
    });
    if (!user) {
        throw comment_types_1.GetCommentPostError.UNAUTHORIZED;
    }
    const comments = await prisma_1.prismaClient.comment.findMany({
        orderBy: { createdAt: "desc" },
        skip: (parameters.page - 1) * parameters.limit,
        take: parameters.limit,
        include: {
            user: {
                select: { id: true, name: true },
            },
            post: {
                select: { id: true, title: true },
            },
        },
    });
    if (!comments || comments.length === 0) {
        throw comment_types_1.GetCommentPostError.BAD_REQUEST;
    }
    const total = await prisma_1.prismaClient.comment.count();
    return {
        comments,
        total,
    };
};
exports.getAllComments = getAllComments;
const getCommentsByUser = async (parameters) => {
    const comments = await prisma_1.prismaClient.comment.findMany({
        where: { userId: parameters.userId },
        orderBy: { createdAt: "desc" },
        skip: (parameters.page - 1) * parameters.limit,
        take: parameters.limit,
        include: {
            post: {
                select: { id: true, title: true },
            },
        },
    });
    const totalComments = await prisma_1.prismaClient.comment.count({
        where: { userId: parameters.userId },
    });
    return {
        comments,
        total: totalComments,
    };
};
exports.getCommentsByUser = getCommentsByUser;
