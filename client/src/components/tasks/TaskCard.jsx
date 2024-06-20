import React, { useState, useEffect } from "react";
import { useTasks } from "../../context/tasksContext";
import { Button, ButtonLink, Card } from "../ui";

// Component to display task card
export function TaskCard({ task }) {
  const { deleteTask, updateTask } = useTasks();
  const [pagado, setPagado] = useState(task.pagado);
  const [fechasAdeudadas, setFechasAdeudadas] = useState([]);
  const [proximoPago, setProximoPago] = useState(null);
  const [ultimoIngreso, setUltimoIngreso] = useState(null);

  useEffect(() => {
    calcularFechasAdeudadas(task.fechaInicioMembresia);
    setUltimoIngreso(task.ultimoIngreso);
  }, [task.fechaInicioMembresia, task.ultimoIngreso]);

  const handleAbonoClick = async () => {
    try {
      if (fechasAdeudadas.length > 0) {
        fechasAdeudadas.shift();
        setFechasAdeudadas([...fechasAdeudadas]);
        setPagado(fechasAdeudadas.length === 0);
        calcularProximoPago(task.fechaInicioMembresia);
        await updateTask(task._id, { ...task, pagado: true });
      }
    } catch (error) {
      console.error("Error al registrar el pago:", error);
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
    <Card className="p-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2 text-white">
          {task.nombre} {task.apellido}
        </h1>
        <p className="text-gray-500">DNI: {task.dni}</p>
        <p className="text-gray-500">
          Fecha de Nacimiento: {task.fechaNacimiento && new Date(task.fechaNacimiento).toLocaleDateString("es-ES")}
        </p>
        <p className="text-gray-500">
          Fecha de alta de cuenta: {task.fechaInicioMembresia && new Date(task.fechaInicioMembresia).toLocaleDateString("es-ES")}
        </p>
        <p className="text-gray-500">
          Último ingreso: {ultimoIngreso ? new Date(ultimoIngreso).toLocaleString("es-ES") : "Sin información"}
        </p>
      </div>
      {!pagado && proximoPago && (
        <p className="text-blue-500">
          Próximo pago: {proximoPago.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
      {!pagado && fechasAdeudadas.length > 0 && (
        <p className="text-red-500">
          Fechas adeudadas: {fechasAdeudadas.map((fecha) => fecha.toLocaleDateString("es-ES")).join(", ")}
        </p>
      )}
      <p className="text-gray-500">{task.comentarios}</p>
      <div className="mt-4 flex justify-between">
        {!pagado && fechasAdeudadas.length > 0 && (
          <Button onClick={handleAbonoClick}>Abono</Button>
        )}
        <div className="flex gap-x-2 items-center">
          <Button onClick={() => deleteTask(task._id)}>Delete</Button>
          <ButtonLink to={`/tasks/${task._id}`}>Edit</ButtonLink>
        </div>
      </div>
    </Card>
  );
}
