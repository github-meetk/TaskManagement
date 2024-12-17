import axios from "axios";

const API_URL = "http://localhost:4000/api/tasks";
const API_URL_AUTH = "http://localhost:4000/api/auth";

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

export const loginAPI = async (data) => {
  await axios.post(`${API_URL_AUTH}/login`, data);
};

export const signupAPI = async (data) => {
  await axios.post(`${API_URL_AUTH}/signup`, data);
};

export const sendotpAPI = async (data) => {
  await axios.post(`${API_URL_AUTH}/sendotp`, data);
};
