import { Router } from 'express';
import {
  createPayment,
  getPayments,
  getPrices,
  addPrice,
  updatePrice,
  deletePrice,
  getPriceEvolution // Asegúrate de importar esta función
} from '../controllers/payment.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

// Rutas para pagos
router.post("/pagos", createPayment); 
router.get("/pagos", getPayments);

// Rutas para precios
router.get('/precios', authRequired, getPrices); // Obtener todos los precios
router.post('/precios', authRequired, addPrice); // Agregar un nuevo precio
router.put('/precios/:id', authRequired, updatePrice); // Actualizar un precio
router.delete('/precios/:id', authRequired, deletePrice); // Eliminar un precio
router.get('/precios/evolution', authRequired, getPriceEvolution); // Obtener la evolución de precios

export default router;
