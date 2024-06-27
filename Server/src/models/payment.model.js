import mongoose from 'mongoose';

const PagoSchema = new mongoose.Schema({
  monto: {
    type: Number,
    required: true,
  },
  usuario: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

const Pago = mongoose.model('Pago', PagoSchema);

export default Pago;
