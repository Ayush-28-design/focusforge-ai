import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} from "../controllers/task.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticateUser, createTask);

router.get("/", authenticateUser, getTasks);

router.get("/stats", authenticateUser, getTaskStats);

router.get("/:id", authenticateUser, getTaskById);

router.put("/:id", authenticateUser, updateTask);

router.delete("/:id", authenticateUser, deleteTask);

export default router;
