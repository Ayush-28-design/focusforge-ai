import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  description: z.string().optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),

  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),

  dueDate: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),

  description: z.string().optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),

  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),

  dueDate: z.string().optional(),
});
