import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { getTasks, getTask, createTask, updateTask, deleteTask, findTaskByDNI } from '../controllers/task.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createTaskSchema } from '../schemas/task.schema.js';
import { getTaskSchema } from '../schemas/task.schema.js';
import { registrarAcceso } from '../controllers/access.controller.js';

const router = Router();

router.get('/tasks', authRequired, getTasks);
router.get('/tasks/:id', authRequired, getTask);
router.post('/tasks', authRequired, createTask);
router.delete('/tasks/:id', authRequired, deleteTask);
router.put('/tasks/:id', authRequired, updateTask);

// Ruta para buscar una tarea por DNI
router.get('/tasks/dni/:dni', authRequired, async (req, res) => {
  try {
    const dni = req.params.dni;
    const task = await findTaskByDNI(dni);
    if (!task) {
      console.log('Tarea no encontrada para el DNI:', dni);
      return res.status(404).json({ message: 'Task not found for the given DNI' });
    }
    console.log('Tarea encontrada para el DNI:', dni);
    return res.json(task);
  } catch (error) {
    console.error('Error al buscar la tarea por DNI:', error);
    return res.status(500).json({ message: 'Error searching task by DNI' });
  }
});

export default router;
