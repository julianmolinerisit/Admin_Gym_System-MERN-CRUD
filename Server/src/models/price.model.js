// backend/models/price.model.js

import mongoose from "mongoose";

const EvolucionPrecioSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  precio: { type: Number, required: true },
});

const EvolucionPrecio = mongoose.model("EvolucionPrecio", EvolucionPrecioSchema);

export default EvolucionPrecio;
