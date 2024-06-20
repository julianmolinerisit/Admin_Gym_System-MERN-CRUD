import axios from "./axios";

// Fetches all tasks
export const getTasksRequest = async () => axios.get("/tasks");

// Creates a new task
export const createTaskRequest = async (task) => axios.post("/tasks", task);

// Updates an existing task by ID
export const updateTaskRequest = async (id, task) => axios.put(`/tasks/${id}`, task);

// Deletes a task by ID
export const deleteTaskRequest = async (id) => axios.delete(`/tasks/${id}`);

// Fetches a task by ID
export const getTaskRequest = async (id) => axios.get(`/tasks/${id}`);

// Finds a task by DNI
export const findTaskByDNIRequest = async (dni) => axios.get(`/tasks/dni/${dni}`);
