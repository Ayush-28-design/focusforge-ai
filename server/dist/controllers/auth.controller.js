"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const auth_validator_1 = require("../validators/auth.validator");
const registerUser = async (req, res) => {
    try {
        const validatedData = auth_validator_1.registerSchema.parse(req.body);
        const existingUser = await prisma_1.default.user.findUnique({
            where: {
                email: validatedData.email,
            },
        });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(validatedData.password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
            },
        });
        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error,
        });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const validatedData = auth_validator_1.loginSchema.parse(req.body);
        const user = await prisma_1.default.user.findUnique({
            where: {
                email: validatedData.email,
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(validatedData.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            role: user.role,
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).json({
            message: "Login successful",
            token,
            user,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Login failed",
            error,
        });
    }
};
exports.loginUser = loginUser;
