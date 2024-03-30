import React, { useState, useEffect } from "react";
import { useTasks } from "../../context/tasksContext";
import { Button, ButtonLink, Card } from "../ui";

export function TaskCard({ task }) {
  const { deleteTask, updateTask } = useTasks();
  const [pagado, setPagado] = useState(task.pagado);
  const [fechasAdeudadas, setFechasAdeudadas] = useState([]);
  const [proximoPago, setProximoPago] = useState(null);

  useEffect(() => {
    calcularFechasAdeudadas(task.fechaInicioMembresia);
  }, [task.fechaInicioMembresia]);

  const handleAbonoClick = async () => {
    try {
      if (fechasAdeudadas.length > 0) {
        fechasAdeudadas.shift(); // Eliminar la fecha más antigua de la lista
        setFechasAdeudadas([...fechasAdeudadas]); // Actualizar las fechas adeudadas
        setPagado(fechasAdeudadas.length === 0); // Actualizar estado de pagado si no hay más fechas adeudadas
        calcularProximoPago(task.fechaInicioMembresia); // Calcular el próximo pago actualizado
        // Aquí deberías guardar la tarea actualizada en la base de datos
        await updateTask(task._id, { ...task, pagado: true });
      }
    } catch (error) {
      console.error("Error al registrar el pago:", error);
    }
  };

  const calcularFechasAdeudadas = (fechaInicioMembresia) => {
    const fechaInicio = new Date(fechaInicioMembresia);
    const fechaActual = new Date();

    // Calcular la primera fecha de pago un mes después de la fecha de alta
    fechaInicio.setMonth(fechaInicio.getMonth() + 1);

    const fechas = [];
    while (fechaInicio <= fechaActual) {
      fechas.push(new Date(fechaInicio));
      fechaInicio.setMonth(fechaInicio.getMonth() + 1);
    }
    setFechasAdeudadas(fechas); // Actualizar las fechas adeudadas
    calcularProximoPago(fechas); // Calcular el próximo pago
  };

  const calcularProximoPago = (fechas) => {
    if (fechas.length > 0) {
      const proximoPago = new Date(fechas[0]);
      proximoPago.setMonth(proximoPago.getMonth() + 2); // Solo un mes después, ya que se ha pagado solo un mes
      setProximoPago(proximoPago); // Actualizar el próximo pago
    } else {
      setProximoPago(null);
    }
  };

  return (
    <Card>
      <header className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">{task.nombre} {task.apellido}</h1>
          <p>DNI: {task.dni}</p>
        </div>
        <div className="flex gap-x-2 items-center">
          <Button onClick={() => deleteTask(task._id)}>Delete</Button>
          <ButtonLink to={`/tasks/${task._id}`}>Edit</ButtonLink>
          {(!pagado || fechasAdeudadas.length > 0) && (
            <Button onClick={handleAbonoClick}>Abono</Button>
          )}
        </div>
      </header>
      <p>
        Fecha de Nacimiento: {task.fechaNacimiento && new Date(task.fechaNacimiento).toLocaleDateString("es-ES")}
      </p>
      <p>
        Fecha de alta de cuenta: {task.fechaInicioMembresia && new Date(task.fechaInicioMembresia).toLocaleDateString("es-ES")}
      </p>
      {!pagado && proximoPago && (
        <p>
          Próximo pago: {proximoPago.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
      {!pagado && fechasAdeudadas.length > 0 && (
        <p>
          Fechas adeudadas: {fechasAdeudadas.map((fecha) => fecha.toLocaleDateString("es-ES")).join(", ")}
        </p>
      )}
      <p>{task.comentarios}</p>
    </Card>
  );
}
