"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vaild_data = exports.postdata = exports.retype = exports.red = exports.password = exports.email = exports.name = exports.signup = exports.signin = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signin = zod_1.default.object({
    email: zod_1.default.string().trim(),
    password: zod_1.default.string().trim()
});
const regexPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*-])[A-Za-z\d!@#$%&*-]{8,}$/;
exports.signup = zod_1.default.object({
    email: zod_1.default.string().email().trim(),
    name: zod_1.default.string().trim().min(2).max(12).toLowerCase(),
    password: zod_1.default.string().min(8).max(32).regex(regexPattern).trim()
});
exports.name = zod_1.default.object({
    name: zod_1.default.string().trim().min(2).max(12).toLowerCase(),
});
exports.email = zod_1.default.object({
    email: zod_1.default.string().email().trim(),
});
exports.password = zod_1.default.object({
    password: zod_1.default.string().min(8).max(32).regex(regexPattern).trim()
});
//---------- red values------------------------------------
exports.red = zod_1.default.object({
    name: zod_1.default.boolean(),
    email: zod_1.default.boolean(),
    password: zod_1.default.boolean(),
    existing_email: zod_1.default.boolean(),
    retypepswd: zod_1.default.boolean(),
    onbtn: zod_1.default.boolean()
});
//------------retype----------------------------------------
exports.retype = zod_1.default.object({
    retype: zod_1.default.string().trim()
});
//----------------postdata------------------------------
const base64Regex = /^data:image\/[a-zA-Z]+;base64,[a-zA-Z0-9+/=]+$/;
exports.postdata = zod_1.default.object({
    title: zod_1.default.string().min(10).max(100).trim(),
    content: zod_1.default.string().min(20).max(1000).trim(),
    image: zod_1.default.object({
        base64: zod_1.default.string().regex(base64Regex).trim().optional().nullable(),
        name: zod_1.default.string().optional().nullable()
    }),
    tags: zod_1.default.array(zod_1.default.string().min(1).max(15).trim()).min(1).max(5)
});
// --------------------only for backend vaild_data----------
exports.vaild_data = zod_1.default.object({
    frd_id: zod_1.default.string().min(1).optional(),
    id: zod_1.default.string().min(1).optional(),
    txt: zod_1.default.string().min(1).max(15).optional()
});
