import React, { useState, useEffect } from "react";
import { useTasks } from "../../context/tasksContext";
import { Button, ButtonLink, Card } from "../ui";

export function TaskCard({ task }) {
  const { deleteTask, updateTask } = useTasks();
  const [pagado, setPagado] = useState(task.pagado);
  const [fechasAdeudadas, setFechasAdeudadas] = useState([]);
  const [alerta, setAlerta] = useState("");

  const handleAbonoClick = async () => {
    try {
      await updateTask(task._id, { ...task, pagado: true });
      setPagado(true); // Actualiza el estado de pagado
    } catch (error) {
      console.error("Error al registrar el pago:", error);
    }
  };

  useEffect(() => {
    const calcularFechasAdeudadas = (fechaInicioMembresia) => {
      const fechaInicio = new Date(fechaInicioMembresia);
      const fechaActual = new Date();

      // Calcular fechas adeudadas desde el mes siguiente al inicio de membresía hasta el mes actual
      let fechaProximoPago = new Date(fechaInicio);
      const fechasAdeudadas = [];

      while (fechaProximoPago < fechaActual) {
        fechaProximoPago.setMonth(fechaProximoPago.getMonth() + 1);
        fechasAdeudadas.push(new Date(fechaProximoPago));
      }

      setFechasAdeudadas(fechasAdeudadas);
    };

    calcularFechasAdeudadas(task.fechaInicioMembresia);
  }, [task.fechaInicioMembresia]);

  useEffect(() => {
    const calcularProximoPago = (fechaInicioMembresia) => {
      const fechaInicio = new Date(fechaInicioMembresia);
      const fechaActual = new Date();

      // Calcular el próximo pago
      let fechaProximoPago = new Date(fechaInicio);
      while (fechaProximoPago <= fechaActual) {
        fechaProximoPago.setMonth(fechaProximoPago.getMonth() + 1);
      }

      setAlerta(""); // Restablecer la alerta

      if (fechaProximoPago.getDate() === fechaInicio.getDate()) {
        // Si el próximo pago coincide con el día de inicio de membresía, mostrar mensaje de alerta
        setAlerta("¡Alerta! El pago está vencido");
      } else if (fechaProximoPago.getTime() - fechaActual.getTime() <= 7 * 24 * 60 * 60 * 1000) {
        // Si faltan menos de 7 días para el próximo pago, mostrar mensaje de alerta
        setAlerta("En una semana debe abonar");
      }

      return fechaProximoPago;
    };

    calcularProximoPago(task.fechaInicioMembresia);
  }, [task.fechaInicioMembresia]);

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
          {!pagado && <Button onClick={handleAbonoClick}>Abono</Button>}
        </div>
      </header>
      <p>
        Fecha de Nacimiento: {task.fechaNacimiento && new Date(task.fechaNacimiento).toLocaleDateString("es-ES")}
      </p>
      <p>
        Fecha de alta de cuenta: {task.fechaInicioMembresia && new Date(task.fechaInicioMembresia).toLocaleDateString("es-ES")}
      </p>
      <p>
        Próximo pago:{" "}
        {fechasAdeudadas.map((fecha, index) => (
          <span key={index}>
            {fecha.toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {index !== fechasAdeudadas.length - 1 && ", "}
          </span>
        ))}
      </p>
      {alerta && (
        <p className={alerta.includes("¡Alerta!") ? "text-red-500" : "text-blue-500"}>
          {alerta}
        </p>
      )}
      <p>{task.comentarios}</p>
    </Card>
  );
}
