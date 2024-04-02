import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
  getTaskRequest,
  updateTaskRequest,
} from "../api/tasks";

// Crear el contexto de tareas
const TaskContext = createContext();

// Hook personalizado para usar el contexto de tareas
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};

// Proveedor de tareas que proporciona el contexto a los componentes hijos
export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // Función para obtener todas las tareas
  const getTasks = async () => {
    try {
      const res = await getTasksRequest();
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Función para eliminar una tarea por su ID
  const deleteTask = async (id) => {
    try {
      const res = await deleteTaskRequest(id);
      if (res.status === 204) setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
    }
  };

  // Función para crear una nueva tarea
  const createTask = async (task) => {
    try {
      const res = await createTaskRequest(task);
      console.log("Task created:", res.data); // Registro de la tarea creada
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Función para obtener una tarea por su ID
  const getTask = async (id) => {
    try {
      const res = await getTaskRequest(id);
      return res.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
    }
  };

  // Función para actualizar una tarea por su ID
  const updateTask = async (id, task) => {
    try {
      const res = await updateTaskRequest(id, task);
      console.log("Task updated:", res.data); // Registro de la tarea actualizada
      // Puedes realizar otras acciones después de actualizar la tarea si es necesario
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error);
    }
  };

  // Efecto para cargar las tareas al iniciar el contexto
  useEffect(() => {
    getTasks();
  }, []);

  // Proporcionar el contexto y las funciones a los componentes hijos
  return (
    <TaskContext.Provider
      value={{
        tasks,
        getTasks,
        deleteTask,
        createTask,
        getTask,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
