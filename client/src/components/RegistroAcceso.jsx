import { registrarAccesoRequest } from "../api/access";
import React, { useState, useEffect } from "react";
import { Card } from "./ui/Card";
import { findTaskByDNIRequest } from "../api/tasks"; // Importa la función para buscar por DNI
import { Button } from "./ui/Button";

const RegistroAcceso = ({ setShowCard }) => {
  const [dni, setDni] = useState("");
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [taskInfo, setTaskInfo] = useState(null); // Estado para almacenar la información de la tarea encontrada
  const [pagado, setPagado] = useState(false);
  const [fechasAdeudadas, setFechasAdeudadas] = useState([]);
  const [proximoPago, setProximoPago] = useState(null);
  const [ultimoIngreso, setUltimoIngreso] = useState(null);

  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registrarAccesoRequest(dni);
      setRegistrationMessage("Acceso registrado con éxito");
      console.log("DNI registrado:", dni);
      setDni("");
      setShowCard(true); // Mostrar la tarjeta al registrar el acceso correctamente

      // Realizar la búsqueda por DNI después de registrar el acceso
      const taskResponse = await findTaskByDNIRequest(dni);
      const taskData = taskResponse.data;

      setTaskInfo(taskData); // Almacena la información de la tarea encontrada
      setPagado(taskData.pagado);
      setUltimoIngreso(taskData.ultimoIngreso);

      calcularFechasAdeudadas(taskData.fechaInicioMembresia);
    } catch (error) {
      setRegistrationMessage("Error al registrar el acceso");
      console.error("Error al registrar el acceso:", error.message);
    }
  };

  const calcularFechasAdeudadas = (fechaInicioMembresia) => {
    const fechaInicio = new Date(fechaInicioMembresia);
    const fechaActual = new Date();

    fechaInicio.setMonth(fechaInicio.getMonth() + 1);

    const fechas = [];
    while (fechaInicio <= fechaActual) {
      fechas.push(new Date(fechaInicio));
      fechaInicio.setMonth(fechaInicio.getMonth() + 1);
    }
    setFechasAdeudadas(fechas);
    calcularProximoPago(fechas);
  };

  const calcularProximoPago = (fechas) => {
    if (fechas.length > 0) {
      const proximoPago = new Date(fechas[0]);
      proximoPago.setMonth(proximoPago.getMonth() + 2);
      setProximoPago(proximoPago);
    } else {
      setProximoPago(null);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-4">Registro de Acceso</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="dni"
              className="block text-gray-700 font-medium mb-2"
            >
              DNI:
            </label>
            <input
              type="text"
              id="dni"
              name="dni"
              value={dni}
              onChange={handleDniChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-black"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Registrar Acceso
          </Button>
          {registrationMessage && (
            <p
              className={
                registrationMessage.includes("Error")
                  ? "text-red-600"
                  : "text-green-600"
              }
            >
              {registrationMessage}
            </p>
          )}
        </form>
        {/* Mostrar la información de la tarea encontrada si existe */}
        {taskInfo && (
          <div>
            <h1 className="text-xl font-bold mb-2 text-white">
              {taskInfo.nombre} {taskInfo.apellido}
            </h1>
            <p className="text-gray-500">DNI: {taskInfo.dni}</p>
            <p className="text-gray-500">
              Último ingreso:{" "}
              {ultimoIngreso
                ? new Date(ultimoIngreso).toLocaleString("es-ES")
                : "Sin información"}
            </p>
            {!pagado && proximoPago && (
              <p className="text-blue-500">
                Próximo pago:{" "}
                {proximoPago.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            {!pagado && fechasAdeudadas.length > 0 && (
              <p className="text-red-500">
                Fechas adeudadas:{" "}
                {fechasAdeudadas
                  .map((fecha) => fecha.toLocaleDateString("es-ES"))
                  .join(", ")}
              </p>
            )}{" "}
          </div>
        )}
      </Card>
    </div>
  );
};

export default RegistroAcceso;
