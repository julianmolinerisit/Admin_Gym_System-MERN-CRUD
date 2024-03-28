import React, { createContext, useContext, useState } from "react";
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
  getTaskRequest,
  updateTaskRequest, // Importa la función de actualización de tareas
} from "../api/tasks";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    const res = await getTasksRequest();
    setTasks(res.data);
  };

  const deleteTask = async (id) => {
    try {
      const res = await deleteTaskRequest(id);
      if (res.status === 204) setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async (task) => {
    try {
      const res = await createTaskRequest(task);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTask = async (id) => {
    try {
      const res = await getTaskRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  // Función para actualizar una tarea existente
  const updateTask = async (id, task) => {
    try {
      const res = await updateTaskRequest(task); // Se pasa solo el objeto de la tarea
      // Resto del código
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <TaskContext.Provider
      value={{
        tasks,
        getTasks,
        deleteTask,
        createTask,
        getTask,
        updateTask, // Agrega la función updateTask al contexto
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
