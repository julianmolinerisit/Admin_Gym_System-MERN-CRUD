import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export default function RegistroAccesoPage() {
  const [dni, setDni] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');

  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/acceso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dni })
      });
      
      if (!response.ok) {
        throw new Error('Error al registrar el acceso');
      }

      setRegistrationMessage('Acceso registrado con éxito');
      console.log("DNI registrado:", dni);
      setDni('');
    } catch (error) {
      setRegistrationMessage('Error al registrar el acceso');
      console.error("Error al registrar el acceso:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-4">Registro de Acceso</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="dni" className="block text-gray-700 font-medium mb-2">DNI:</label>
            <input
              type="text"
              id="dni"
              name="dni"
              value={dni}
              onChange={handleDniChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Registrar Acceso
          </Button>
          {registrationMessage && <p className={registrationMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}>{registrationMessage}</p>}
        </form>
      </Card>
    </div>
  );
}
