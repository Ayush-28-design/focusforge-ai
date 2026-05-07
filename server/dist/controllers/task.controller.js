"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskStats = exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const task_validator_1 = require("../validators/task.validator");
const prisma_client_1 = __importDefault(require("../utils/prisma.client"));
const response_util_1 = require("../utils/response.util");
const createTask = async (req, res) => {
    try {
        const validatedData = task_validator_1.createTaskSchema.parse(req.body);
        const { title, description, priority, status, dueDate } = validatedData;
        const task = await prisma_client_1.default.task.create({
            data: {
                title,
                description,
                priority,
                status,
                dueDate: dueDate ? new Date(dueDate) : null,
                userId: req.user.id,
            },
        });
        return (0, response_util_1.successResponse)(res, "Task created successfully", task, 201);
    }
    catch (error) {
        return (0, response_util_1.errorResponse)(res, error.message);
    }
};
exports.createTask = createTask;
const getTasks = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, priority, search, sortBy = "createdAt", order = "desc", } = req.query;
        const filters = {
            userId: req.user.id,
        };
        if (status) {
            filters.status = status;
        }
        if (priority) {
            filters.priority = priority;
        }
        if (search) {
            filters.OR = [
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const tasks = await prisma_client_1.default.task.findMany({
            where: filters,
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            orderBy: {
                [sortBy]: order,
            },
        });
        const totalTasks = await prisma_client_1.default.task.count({
            where: filters,
        });
        return (0, response_util_1.successResponse)(res, "Tasks fetched successfully", {
            tasks,
            pagination: {
                total: totalTasks,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalTasks / limitNumber),
            },
        });
    }
    catch (error) {
        return (0, response_util_1.errorResponse)(res, error.message);
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res) => {
    try {
        const task = await prisma_client_1.default.task.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });
        if (!task) {
            return (0, response_util_1.errorResponse)(res, "Task not found", 404);
        }
        return (0, response_util_1.successResponse)(res, "Task fetched successfully", task);
    }
    catch (error) {
        return (0, response_util_1.errorResponse)(res, error.message);
    }
};
exports.getTaskById = getTaskById;
const updateTask = async (req, res) => {
    try {
        const validatedData = task_validator_1.updateTaskSchema.parse(req.body);
        const task = await prisma_client_1.default.task.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });
        if (!task) {
            return (0, response_util_1.errorResponse)(res, "Task not found", 404);
        }
        const updatedTask = await prisma_client_1.default.task.update({
            where: {
                id: req.params.id,
            },
            data: {
                ...validatedData,
                dueDate: validatedData.dueDate
                    ? new Date(validatedData.dueDate)
                    : undefined,
            },
        });
        return (0, response_util_1.successResponse)(res, "Task updated successfully", updatedTask);
    }
    catch (error) {
        return (0, response_util_1.errorResponse)(res, error.message);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const task = await prisma_client_1.default.task.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });
        if (!task) {
            return (0, response_util_1.errorResponse)(res, "Task not found", 404);
        }
        await prisma_client_1.default.task.delete({
            where: {
                id: req.params.id,
            },
        });
        return (0, response_util_1.successResponse)(res, "Task deleted successfully");
    }
    catch (error) {
        return (0, response_util_1.errorResponse)(res, error.message);
    }
};
exports.deleteTask = deleteTask;
const getTaskStats = async (req, res) => {
    try {
        const tasks = await prisma_client_1.default.task.findMany({
            where: {
                userId: req.user.id,
            },
        });
        const total = tasks.length;
        const completed = tasks.filter((task) => task.status === "COMPLETED").length;
        const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length;
        const todo = tasks.filter((task) => task.status === "TODO").length;
        return (0, response_util_1.successResponse)(res, "Task stats fetched successfully", {
            total,
            completed,
            inProgress,
            todo,
        });
    }
    catch (error) {
        return (0, response_util_1.errorResponse)(res, error.message);
    }
};
exports.getTaskStats = getTaskStats;
