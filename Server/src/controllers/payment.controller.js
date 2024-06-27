import Pago from '../models/payment.model.js';
import EvolucionPrecio from '../models/price.model.js';

// Controlador para registrar un nuevo pago
export const createPayment = async (req, res) => {
  try {
    const { monto, usuario, fecha } = req.body;
    const nuevoPago = new Pago({ monto, usuario, fecha });
    await nuevoPago.save();
    res.status(201).json(nuevoPago);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el pago' });
  }
};



// Controlador para obtener todos los pagos
export const getPayments = async (req, res) => {
  try {
    const pagos = await Pago.find();
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pagos' });
  }
};

// Controlador para actualizar el precio mensual
// export const updatePrecioMensual = async (req, res) => {
//   try {
//     const { precioMensual } = req.body;
//     const nuevoPrecio = new EvolucionPrecio({ precio: precioMensual });
//     await nuevoPrecio.save();
//     res.json(nuevoPrecio);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Controlador para obtener el precio mensual más reciente
export const getPrecioMensual = async (req, res) => {
  try {
    const ultimoPrecio = await EvolucionPrecio.findOne().sort({ fecha: -1 });
    if (!ultimoPrecio) return res.status(404).json({ message: 'Precio no encontrado' });
    res.json(ultimoPrecio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para obtener todos los precios
export const getPrices = async (req, res) => {
  try {
    const prices = await EvolucionPrecio.find();
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para agregar un nuevo precio
export const addPrice = async (req, res) => {
  try {
    const { precio } = req.body;
    const nuevoPrecio = new EvolucionPrecio({ precio });
    await nuevoPrecio.save();
    res.status(201).json(nuevoPrecio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para actualizar un precio existente
export const updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { precio } = req.body;
    const updatedPrice = await EvolucionPrecio.findByIdAndUpdate(id, { precio }, { new: true });
    if (!updatedPrice) return res.status(404).json({ message: 'Precio no encontrado' });
    res.json(updatedPrice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para eliminar un precio existente
export const deletePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPrice = await EvolucionPrecio.findByIdAndDelete(id);
    if (!deletedPrice) return res.status(404).json({ message: 'Precio no encontrado' });
    res.json({ message: 'Precio eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para obtener la evolución de precios
export const getPriceEvolution = async (req, res) => {
  try {
    const priceData = await EvolucionPrecio.find();
    res.json(priceData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
