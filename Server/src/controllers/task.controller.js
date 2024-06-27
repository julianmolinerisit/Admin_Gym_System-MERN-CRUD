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
    if (!deletedTask) {
      console.log(`No se encontró la tarea con el ID: ${req.params.id}`);
      return res.status(404).json({ message: "Task not found" });
    }
    console.log(`Tarea eliminada correctamente: ${deletedTask}`);
    return res.sendStatus(204);
  } catch (error) {
    console.error(`Error al eliminar la tarea: ${error.message}`);
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

export const getTaskWithDebt = async (req, res) => {
  try {
      const task = await Task.findById(req.params.id);
      if (!task) {
          return res.status(404).json({ error: 'Task not found' });
      }

      const deuda = await calculateDebt(task.fechaInicioMembresia, task.ultimoPago);
      res.status(200).json({ ...task.toObject(), deuda });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Ejemplo de una función para actualizar el precio mensual
export const updatePrecioMensualRequest = async (precioMensual) => {
  try {
    const response = await axios.put('/api/precios', { precioMensual });
    return response.data;
  } catch (error) {
    console.error('Error updating monthly price:', error);
    throw error;
  }
};