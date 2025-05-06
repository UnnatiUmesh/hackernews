"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommetError = exports.DeleteCommentError = exports.GetCommentPostError = exports.CommentPostError = void 0;
var CommentPostError;
(function (CommentPostError) {
    CommentPostError[CommentPostError["NOT_FOUND"] = 0] = "NOT_FOUND";
    CommentPostError[CommentPostError["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
})(CommentPostError || (exports.CommentPostError = CommentPostError = {}));
var GetCommentPostError;
(function (GetCommentPostError) {
    GetCommentPostError[GetCommentPostError["BAD_REQUEST"] = 0] = "BAD_REQUEST";
    GetCommentPostError[GetCommentPostError["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
})(GetCommentPostError || (exports.GetCommentPostError = GetCommentPostError = {}));
var DeleteCommentError;
(function (DeleteCommentError) {
    DeleteCommentError[DeleteCommentError["NOT_FOUND"] = 0] = "NOT_FOUND";
    DeleteCommentError[DeleteCommentError["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
})(DeleteCommentError || (exports.DeleteCommentError = DeleteCommentError = {}));
var UpdateCommetError;
(function (UpdateCommetError) {
    UpdateCommetError[UpdateCommetError["NOT_FOUND"] = 0] = "NOT_FOUND";
    UpdateCommetError[UpdateCommetError["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
})(UpdateCommetError || (exports.UpdateCommetError = UpdateCommetError = {}));
