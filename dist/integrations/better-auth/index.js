"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const better_auth_1 = require("better-auth");
const environment_js_1 = require("../../environment.js");
const prisma_1 = require("better-auth/adapters/prisma");
// import { prismaClient } from "../prisma";
const plugins_1 = require("better-auth/plugins");
const index_js_1 = require("../prisma/index.js");
const betterAuthServerClient = (0, better_auth_1.betterAuth)({
    baseURL: environment_js_1.serverUrl,
    trustedOrigins: [environment_js_1.webClientUrl],
    secret: environment_js_1.betterAuthSecret,
    plugins: [(0, plugins_1.username)()],
    database: (0, prisma_1.prismaAdapter)(index_js_1.prismaClient, {
        provider: "postgresql",
    }),
    user: {
        modelName: "User",
    },
    session: {
        modelName: "Session",
    },
    account: {
        modelName: "Account",
    },
    verification: {
        modelName: "Verification",
    },
    emailAndPassword: {
        enabled: true,
    },
});
exports.default = betterAuthServerClient;
