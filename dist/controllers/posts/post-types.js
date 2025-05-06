"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePostError = exports.GetMePostError = exports.GetPostError = exports.CreatePostError = void 0;
var CreatePostError;
(function (CreatePostError) {
    CreatePostError[CreatePostError["BAD_REQUEST"] = 0] = "BAD_REQUEST";
    CreatePostError[CreatePostError["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
})(CreatePostError || (exports.CreatePostError = CreatePostError = {}));
var GetPostError;
(function (GetPostError) {
    GetPostError[GetPostError["BAD_REQUEST"] = 0] = "BAD_REQUEST";
})(GetPostError || (exports.GetPostError = GetPostError = {}));
var GetMePostError;
(function (GetMePostError) {
    GetMePostError[GetMePostError["BAD_REQUEST"] = 0] = "BAD_REQUEST";
})(GetMePostError || (exports.GetMePostError = GetMePostError = {}));
var DeletePostError;
(function (DeletePostError) {
    DeletePostError[DeletePostError["NOT_FOUND"] = 0] = "NOT_FOUND";
    DeletePostError[DeletePostError["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
})(DeletePostError || (exports.DeletePostError = DeletePostError = {}));
