import Task from "../models/task.model.js";
import { createTaskSchema } from "../schemas/task.schema.js";


export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).populate("user");
    console.log("Tareas encontradas:", tasks);
    res.json(tasks);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { nombre, apellido, dni, fechaNacimiento, fechaInicioMembresia, comentarios } = req.body;

    // Agregar registro para mostrar los datos recibidos
    console.log("Datos recibidos para la creación de la tarea:", req.body);

    // Verificar si el campo 'ultimoIngreso' está presente en la solicitud
    const ultimoIngreso = req.body.ultimoIngreso ? req.body.ultimoIngreso : new Date().toISOString().split('T')[0];

    const newTask = new Task({
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      fechaInicioMembresia,
      comentarios,
      ultimoIngreso, // Incluir el campo 'ultimoIngreso' ya sea con el valor recibido o con la fecha actual
      user: req.user.id,
    });

    // Agregar registro para mostrar la tarea creada
    console.log("Tarea creada:", newTask);

    // Guardar la nueva tarea en la base de datos
    await newTask.save();

    res.json(newTask);
  } catch (error) {
    // Agregar registro para mostrar cualquier error que ocurra durante la creación de la tarea
    console.error("Error al crear la tarea:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      console.log("Tarea no encontrada para eliminar:", req.params.id);
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("Tarea eliminada:", deletedTask);
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { nombre, apellido, dni, fechaNacimiento, fechaInicioMembresia, comentarios, pagado } = req.body;

    const taskUpdated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { nombre, apellido, dni, fechaNacimiento, fechaInicioMembresia, comentarios, pagado },
      { new: true }
    );

    if (!taskUpdated) {
      console.log("Tarea no encontrada o no autorizada para actualizar:", req.params.id);
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    console.log("Tarea actualizada:", taskUpdated);
    return res.json(taskUpdated);
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const registrarAcceso = async (req, res) => {
  try {
    const { ultimoIngreso } = req.body;

    const taskUpdated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ultimoIngreso },
      { new: true }
    );

    if (!taskUpdated) {
      console.log("Tarea no encontrada o no autorizada para registrar acceso:", req.params.id);
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    console.log("Tarea actualizada con último ingreso:", taskUpdated);
    return res.json(taskUpdated);
  } catch (error) {
    console.error("Error al registrar acceso:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      console.log("Tarea no encontrada:", req.params.id);
      return res.status(404).json({ message: "Task not found" });
    }
    console.log("Tarea encontrada:", task);
    return res.json(task);
  } catch (error) {
    console.error("Error al obtener la tarea:", error);
    return res.status(500).json({ message: error.message });
  }
};
