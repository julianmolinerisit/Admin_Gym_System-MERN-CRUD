// statistics.routes.js
import express from 'express';
import { getStatistics, getUserStatistics, getPriceEvolution } from '../controllers/statistics.controller.js';
import { getTasks } from '../controllers/task.controller.js';

const router = express.Router();

router.get('/statistics', getStatistics);
router.get('/user-statistics/:id', getUserStatistics);
router.get('/tasks', getTasks);
router.get('/price-evolution', getPriceEvolution); // Ruta para la evolución del precio

export default router;
