import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.validator";

import { Response } from "express";
import prisma from "../utils/prisma.client";
import { successResponse, errorResponse } from "../utils/response.util";

export const createTask = async (req: any, res: Response) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);

    const { title, description, priority, status, dueDate } = validatedData;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.user.id,
      },
    });

    return successResponse(res, "Task created successfully", task, 201);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const getTasks = async (req: any, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filters: any = {
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

    const tasks = await prisma.task.findMany({
      where: filters,

      skip: (Number(page) - 1) * Number(limit),

      take: Number(limit),

      orderBy: {
        [sortBy]: order,
      },
    });

    const totalTasks = await prisma.task.count({
      where: filters,
    });

    return successResponse(res, "Tasks fetched successfully", {
      tasks,
      pagination: {
        total: totalTasks,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalTasks / limitNumber),
      },
    });
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const getTaskById = async (req: any, res: Response) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!task) {
      return errorResponse(res, "Task not found", 404);
    }

    return successResponse(res, "Task fetched successfully", task);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const updateTask = async (req: any, res: Response) => {
  try {
    const validatedData = updateTaskSchema.parse(req.body);

    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!task) {
      return errorResponse(res, "Task not found", 404);
    }

    const updatedTask = await prisma.task.update({
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

    return successResponse(res, "Task updated successfully", updatedTask);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const deleteTask = async (req: any, res: Response) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!task) {
      return errorResponse(res, "Task not found", 404);
    }

    await prisma.task.delete({
      where: {
        id: req.params.id,
      },
    });

    return successResponse(res, "Task deleted successfully");
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const getTaskStats = async (req: any, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user.id,
      },
    });

    const total = tasks.length;

    const completed = tasks.filter(
      (task) => task.status === "COMPLETED",
    ).length;

    const inProgress = tasks.filter(
      (task) => task.status === "IN_PROGRESS",
    ).length;

    const todo = tasks.filter((task) => task.status === "TODO").length;

    return successResponse(res, "Task stats fetched successfully", {
      total,
      completed,
      inProgress,
      todo,
    });
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};
