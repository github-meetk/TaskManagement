const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.post("/tasks", createTask); // Create Task
router.get("/tasks", getTasks); // Get all Tasks
router.put("/tasks/:taskId", updateTask); // Update Task
router.delete("/tasks/:taskId", deleteTask); // Delete Task

module.exports = router;
