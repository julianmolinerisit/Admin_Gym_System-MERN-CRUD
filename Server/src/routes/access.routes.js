// access.routes.js
import express from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { registrarAcceso } from '../controllers/access.controller.js';

const router = express.Router();

router.put('/acceso/:dni', authRequired, registrarAcceso);

export default router;
