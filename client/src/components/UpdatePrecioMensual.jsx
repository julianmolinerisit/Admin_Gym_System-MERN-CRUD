// src/components/UpdatePrecioMensual.jsx

import React, { useState, useEffect } from 'react';
import { updatePrecioMensualRequest, getPrecioMensualRequest } from '../api/tasks'; // Asegúrate de que esta ruta sea correcta

const UpdatePrecioMensual = () => {
  const [precioMensual, setPrecioMensual] = useState('');
  const [currentPrecio, setCurrentPrecio] = useState(null);

  useEffect(() => {
    const fetchPrecio = async () => {
      try {
        const response = await getPrecioMensualRequest();
        setCurrentPrecio(response.data.precio);
      } catch (error) {
        console.error('Error fetching current price:', error);
      }
    };

    fetchPrecio();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updatePrecioMensualRequest(precioMensual);
      alert('Precio actualizado correctamente');
      setPrecioMensual(''); // Clear the input field after successful update
      const response = await getPrecioMensualRequest();
      setCurrentPrecio(response.data.precio);
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Error actualizando el precio');
    }
  };

  return (
    <div>
      <h2>Actualizar Precio Mensual</h2>
      {currentPrecio !== null && <p>Precio Actual: ${currentPrecio}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nuevo Precio Mensual:
          <input
            type="number"
            value={precioMensual}
            onChange={(e) => setPrecioMensual(e.target.value)}
            required
          />
        </label>
        <button type="submit">Actualizar Precio</button>
      </form>
    </div>
  );
};

export default UpdatePrecioMensual;
