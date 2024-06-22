import React, { useState, useEffect } from "react";
import { useTasks } from "../../context/tasksContext";
import { FaEdit, FaTrash, FaCalendarCheck } from "react-icons/fa";
import { Button, ButtonLink } from "../ui";

export function TaskCard({ task }) {
  const { updateTask, deleteTask } = useTasks();
  const [pagado, setPagado] = useState(task.pagado);
  const [fechasAdeudadas, setFechasAdeudadas] = useState([]);
  const [proximoPago, setProximoPago] = useState(null);
  const [ultimoPago, setUltimoPago] = useState(task.ultimoPago || null);
  const [ultimoIngreso, setUltimoIngreso] = useState(task.ultimoIngreso);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    calcularFechasAdeudadas(task.fechaInicioMembresia, task.ultimoPago);
    setUltimoIngreso(task.ultimoIngreso);
  }, [task.fechaInicioMembresia, task.ultimoPago, task.ultimoIngreso]);

  useEffect(() => {
    calcularProximoPago();
  }, [fechasAdeudadas]);

  const handleAbonoClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (fecha) => {
    const nuevasFechasAdeudadas = fechasAdeudadas.filter(
      (f) => f.getTime() !== fecha.getTime()
    );
    setFechasAdeudadas(nuevasFechasAdeudadas);
    const pagado = nuevasFechasAdeudadas.length === 0;
    setPagado(pagado);
    await updateTask(task._id, { ...task, pagado, ultimoPago: fecha });
    setUltimoPago(fecha);
    setShowForm(false); // Cerrar el formulario después de enviar
  };

  const calcularFechasAdeudadas = (fechaInicioMembresia, ultimoPago) => {
    const fechaInicio = new Date(fechaInicioMembresia);
    const fechaActual = new Date();
    const fechas = [];

    if (!ultimoPago) {
      fechaInicio.setMonth(fechaInicio.getMonth() + 1);
    } else {
      fechaInicio.setTime(new Date(ultimoPago).getTime());
    }

    while (fechaInicio <= fechaActual) {
      fechas.push(new Date(fechaInicio));
      fechaInicio.setMonth(fechaInicio.getMonth() + 1);
    }

    if (
      fechas.length > 0 &&
      fechas[fechas.length - 1].getTime() === fechaActual.getTime()
    ) {
      fechas.pop();
    }

    setFechasAdeudadas(fechas);
    setPagado(fechas.length === 0);
  };

  const calcularProximoPago = () => {
    if (fechasAdeudadas.length > 0) {
      const ultimoPago = fechasAdeudadas[fechasAdeudadas.length - 1];
      const proximoPagoDate = new Date(ultimoPago);
      proximoPagoDate.setMonth(proximoPagoDate.getMonth() + 1);
      setProximoPago(proximoPagoDate);
    } else {
      const fechaInicio = new Date(task.fechaInicioMembresia);
      fechaInicio.setMonth(fechaInicio.getMonth() + 1);
      setProximoPago(fechaInicio);
    }
  };

  const handleDeleteClick = async () => {
    await deleteTask(task._id);
  };

  const handleEditClick = () => {
    console.log("Edit clicked"); // Implementar lógica de edición aquí
  };

  const handleCloseForm = () => {
    setShowForm(false); // Manejar el cierre del formulario
  };

  return (
    <>
      <tr className="text-center">
        <td className="py-2 px-4 text-sm border-b">{task.nombre}</td>
        <td className="py-2 px-4 text-sm border-b">{task.apellido}</td>
        <td className="py-2 px-4 text-sm border-b">{task.dni}</td>
        <td className="py-2 px-4 text-sm border-b">
          {new Date(task.fechaNacimiento).toLocaleDateString()}
        </td>
        <td className="py-2 px-4 text-sm border-b">
          {new Date(task.fechaInicioMembresia).toLocaleDateString()}
        </td>
        <td className="py-2 px-4 text-sm border-b">
          {ultimoPago ? new Date(ultimoPago).toLocaleDateString() : "N/A"}
        </td>
        <td className="py-2 px-4 text-sm border-b">
          {proximoPago ? proximoPago.toLocaleDateString() : "N/A"}
        </td>
        <td className="py-2 px-4 text-sm border-b">
          {ultimoIngreso ? new Date(ultimoIngreso).toLocaleDateString() : "N/A"}
        </td>
        <td className="py-2 px-4 text-sm border-b">{task.comentarios}</td>
        <td className="py-2 px-4 text-sm border-b text-center">
          <span
            className={`inline-block px-3 py-1 text-xs rounded-full text-white ${
              pagado ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {pagado ? "Pagado" : "Adeuda pagos"}
          </span>
        </td>
        <td className="py-2 px-4 text-sm border-b text-center">
          <div className="flex justify-center space-x-4">
            <ButtonLink onClick={handleAbonoClick}>
              <FaCalendarCheck className="text-blue-500 cursor-pointer text-lg"  onClick={handleAbonoClick}/>
            </ButtonLink>

            <ButtonLink to={`/tasks/${task._id}`}>
              <FaEdit className="text-yellow-500 cursor-pointer text-lg" />
            </ButtonLink>
            <ButtonLink onClick={handleDeleteClick}>
              <FaTrash className="text-red-500 cursor-pointer text-lg" />
            </ButtonLink>
          </div>
        </td>
      </tr>
      {showForm && (
  <tr>
    <td colSpan="12" className="py-2 px-4 text-sm border-b">
      <div className="max-w-xs mx-auto">
        <div className="bg-gray-600 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <h3 className="text-lg font-bold mb-4">Fechas adeudadas:</h3>
          {fechasAdeudadas.map((fecha) => (
            <div key={fecha.toISOString()} className="flex items-center justify-between mb-2">
              <span>{fecha.toLocaleDateString()}</span>
              <Button
                className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-lg"
                onClick={() => handleFormSubmit(fecha)}
              >
                Pagar
              </Button>
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <Button className="text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded-lg mr-2" onClick={handleCloseForm}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </td>
  </tr>
)}


    </>
  );
}
