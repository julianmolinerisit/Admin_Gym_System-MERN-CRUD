import Task from "../models/task.model.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).populate("user");
    res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { nombre, apellido, dni, fechaNacimiento, fechaInicioMembresia, comentarios, ultimoPago, // Nuevo campo
    } = req.body;
    const ultimoIngreso = req.body.ultimoIngreso ? req.body.ultimoIngreso : new Date().toISOString().split('T')[0];
    const newTask = new Task({
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      fechaInicioMembresia,
      comentarios,
      ultimoIngreso,
      ultimoPago, // Nuevo campo
      user: req.user.id,
    });
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { nombre, apellido, dni, fechaNacimiento, fechaInicioMembresia, comentarios, pagado,      ultimoPago, // Nuevo campo
    } = req.body;
    const taskUpdated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { nombre, apellido, dni, fechaNacimiento, fechaInicioMembresia, comentarios, pagado,      ultimoPago, // Nuevo campo
      },
      { new: true }
    );
    if (!taskUpdated) return res.status(404).json({ message: "Task not found or unauthorized" });
    return res.json(taskUpdated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const findTaskByDNI = async (dni) => {
  try {
    const task = await Task.findOne({ dni });
    return task;
  } catch (error) {
    throw new Error('Error al buscar la tarea por DNI');
  }
};
