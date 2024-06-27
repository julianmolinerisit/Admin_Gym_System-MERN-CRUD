import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { FaTrash } from 'react-icons/fa';

const PriceManagement = () => {
  const [prices, setPrices] = useState([]);
  const [precioMensual, setPrecioMensual] = useState('');
  const [updatedPrices, setUpdatedPrices] = useState({});

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await axios.get('/precios');
      setPrices(response.data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const handleAddPrice = async () => {
    try {
      await axios.post('/precios', { precio: precioMensual });
      fetchPrices();
      setPrecioMensual('');
    } catch (error) {
      console.error('Error adding price:', error);
    }
  };

  const handleUpdatePrice = async (id) => {
    try {
      await axios.put(`/precios/${id}`, { precio: updatedPrices[id] });
      fetchPrices();
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const handleDeletePrice = async (id) => {
    try {
      await axios.delete(`/precios/${id}`);
      fetchPrices();
    } catch (error) {
      console.error('Error deleting price:', error);
    }
  };

  const handleUpdateChange = (id, value) => {
    setUpdatedPrices({
      ...updatedPrices,
      [id]: value,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-700 rounded-md shadow-md text-white">
      <h1 className="text-2xl font-bold mb-6">Gestionar Precios</h1>
      <div className="mb-4">
        <input
          type="number"
          value={precioMensual}
          onChange={(e) => setPrecioMensual(e.target.value)}
          placeholder="Nuevo Precio"
          className="border p-2 rounded-md w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          required
        />
        <button
          onClick={handleAddPrice}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Agregar Precio
        </button>
      </div>
      <div className="space-y-4">
        {prices.map((p) => (
          <div key={p._id} className="flex items-center justify-between bg-gray-600 p-4 rounded-md shadow-sm">
            <span>{new Date(p.fecha).toLocaleDateString()} - ${p.precio}</span>
            <div className="flex items-center space-x-2">
             
              <button
                onClick={() => handleDeletePrice(p._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceManagement;
