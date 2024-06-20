// controllers/access.controller.js
import Task from "../models/task.model.js";

export const registrarAcceso = async (req, res) => {
  try {
    const { dni } = req.params;

    const taskUpdated = await Task.findOneAndUpdate(
      { dni, user: req.user.id },
      { ultimoIngreso: new Date() }, // Actualizamos el campo de último ingreso con la fecha actual
      { new: true }
    );

    if (!taskUpdated) {
      console.log("Tarea no encontrada o no autorizada para registrar acceso:", dni);
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    console.log("Tarea actualizada con último ingreso:", taskUpdated);
    return res.json(taskUpdated);
  } catch (error) {
    console.error("Error al registrar acceso:", error);
    return res.status(500).json({ message: error.message });
  }
};