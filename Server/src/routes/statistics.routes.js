// statistics.routes.js
import express from 'express';
import {
  getStatistics,
  getUserStatistics,
  getPriceEvolution,
  getActiveUsersEvolution
} from '../controllers/statistics.controller.js';
import { getTasks } from '../controllers/task.controller.js';

const router = express.Router();

router.get('/statistics', getStatistics);
router.get('/user-statistics/:id', getUserStatistics);
router.get('/tasks', getTasks);
router.get('/price-evolution', getPriceEvolution);
router.get('/active-users-evolution', getActiveUsersEvolution);


export default router;