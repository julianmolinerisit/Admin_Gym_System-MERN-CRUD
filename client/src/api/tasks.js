import axios from "./axios";

export const getTasksRequest = async () => {
  try {
    const response = await axios.get("/tasks");
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const createTaskRequest = async (taskData) => {
  try {
    console.log("Datos de tarea enviados al servidor:", taskData); // Agregar registro de datos enviados
    const response = await axios.post('http://localhost:4000/api/tasks', taskData);
    console.log("Respuesta del servidor al crear la tarea:", response.data); // Agregar registro de respuesta del servidor
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};


export const updateTaskRequest = async (id, task) => {
  try {
    const response = await axios.put(`/tasks/${id}`, task);
    return response.data;
  } catch (error) {
    console.error(`Error updating task with ID ${id}:`, error);
    throw error;
  }
};

export const deleteTaskRequest = async (id) => {
  try {
    const response = await axios.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting task with ID ${id}:`, error);
    throw error;
  }
};

export const getTaskRequest = async (id) => {
  try {
    const response = await axios.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw error;
  }
};
