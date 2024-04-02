import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { getTasks, getTask, createTask, updateTask, deleteTask, registrarAcceso } from '../controllers/task.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createTaskSchema } from '../schemas/task.schema.js';

const router = Router();

router.get('/tasks', authRequired, getTasks);
router.get('/tasks/:id', authRequired, getTask);
router.post('/tasks', authRequired, validateSchema(createTaskSchema), createTask);
router.put('/tasks/:id', authRequired, updateTask);
router.put('/tasks/:id/acceso', authRequired, registrarAcceso); // Nueva ruta para registrar acceso
router.delete('/tasks/:id', authRequired, deleteTask);

export default router;
