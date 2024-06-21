import React, { useState, useEffect } from "react";
import { useTasks } from "../../context/tasksContext";
import { Button, ButtonLink } from "../ui";

export function TaskCard({ task }) {
  const { updateTask, deleteTask } = useTasks();
  const [pagado, setPagado] = useState(task.pagado);
  const [fechasAdeudadas, setFechasAdeudadas] = useState([]);
  const [proximoPago, setProximoPago] = useState(null);
  const [ultimoIngreso, setUltimoIngreso] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    calcularFechasAdeudadas(task.fechaInicioMembresia);
    setUltimoIngreso(task.ultimoIngreso);
  }, [task.fechaInicioMembresia, task.ultimoIngreso]);

  const handleAbonoClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (fecha) => {
    const nuevasFechasAdeudadas = fechasAdeudadas.filter((f) => f !== fecha);
    setFechasAdeudadas(nuevasFechasAdeudadas);
    const pagado = nuevasFechasAdeudadas.length === 0;
    setPagado(pagado);
    await updateTask(task._id, { ...task, pagado });
    setShowForm(false);
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

  const handleDeleteClick = async () => {
    await deleteTask(task._id);
  };

  return (
    <tr>
      <td className="py-2 px-4 border-b">{task.nombre}</td>
      <td className="py-2 px-4 border-b">{task.apellido}</td>
      <td className="py-2 px-4 border-b">{task.dni}</td>
      <td className="py-2 px-4 border-b">{task.fechaNacimiento}</td>
      <td className="py-2 px-4 border-b">{ultimoIngreso}</td>
      <td className="py-2 px-4 border-b">{proximoPago ? proximoPago.toLocaleDateString() : "N/A"}</td>
      <td className="py-2 px-4 border-b">{task.comentarios}</td>

      <td className="py-2 px-4 border-b text-center">
        <span className={`inline-block px-2 py-1 rounded-full text-white ${pagado ? "bg-green-500" : "bg-red-500"}`}>
          {pagado ? "Pagado" : "Adeuda pagos"}
        </span>
      </td>
      <td className="py-2 px-4 border-b text-center">
        <Button onClick={handleAbonoClick}>Registrar Pago</Button>
        <ButtonLink to={`/tasks/${task._id}`}>Editar</ButtonLink>
        <Button onClick={handleDeleteClick}>Eliminar</Button>
      </td>
      {showForm && (
        <div>
          <h3>Fechas adeudadas:</h3>
          {fechasAdeudadas.map((fecha) => (
            <div key={fecha}>
              <span>{fecha.toLocaleDateString()}</span>
              <Button onClick={() => handleFormSubmit(fecha)}>Pagar</Button>
            </div>
          ))}
        </div>
      )}
    </tr>
  );
}
