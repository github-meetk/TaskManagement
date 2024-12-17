import axios from "axios";

const API_URL = "http://localhost:4000/api/tasks";

export const getTasksAPI = async () => {
  return await axios.get(API_URL);
};

export const createTaskAPI = async (task) => {
  await axios.post(API_URL, task);
};

export const updateTaskAPI = async (taskId, task) => {
  await axios.put(`${API_URL}/${taskId}`, task);
};

export const deleteTaskAPI = async (taskId) => {
  await axios.delete(`${API_URL}/${taskId}`);
};
