import React, { useState, useEffect } from "react";
import { useTasks } from "../../context/tasksContext";
import { FaEdit, FaTrash, FaCalendarCheck } from "react-icons/fa";
import { Button, ButtonLink } from "../ui";
import axios from '../../api/axios'; // Asegúrate de que la ruta sea correcta

export function TaskCard({ task }) {
  const { updateTask, deleteTask } = useTasks();
  const [pagado, setPagado] = useState(task.pagado);
  const [fechasAdeudadas, setFechasAdeudadas] = useState([]);
  const [proximoPago, setProximoPago] = useState(null);
  const [ultimoPago, setUltimoPago] = useState(task.ultimoPago || null);
  const [ultimoIngreso, setUltimoIngreso] = useState(task.ultimoIngreso);
  const [showForm, setShowForm] = useState(false);
  const [totalAdeudado, setTotalAdeudado] = useState(0);
  const [preciosHistoricos, setPreciosHistoricos] = useState([]);

  useEffect(() => {
    fetchPreciosHistoricos();
    calcularFechasAdeudadas(task.fechaInicioMembresia, task.ultimoPago);
    setUltimoIngreso(task.ultimoIngreso);
  }, [task.fechaInicioMembresia, task.ultimoPago, task.ultimoIngreso]);

  useEffect(() => {
    calcularProximoPago();
    if (preciosHistoricos.length > 0 && fechasAdeudadas.length > 0) {
      calcularTotalAdeudado(fechasAdeudadas);
    }
  }, [fechasAdeudadas, preciosHistoricos]);

  const fetchPreciosHistoricos = async () => {
    try {
      const response = await axios.get('/precios');
      setPreciosHistoricos(response.data);
      console.log('Precios históricos:', response.data); // Log para verificar la respuesta
    } catch (error) {
      console.error('Error fetching historical prices:', error);
    }
  };

  const handleAbonoClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (fecha) => {
    try {
      const nuevasFechasAdeudadas = fechasAdeudadas.filter(
        (f) => f.getTime() !== fecha.getTime()
      );
      setFechasAdeudadas(nuevasFechasAdeudadas);
      const pagado = nuevasFechasAdeudadas.length === 0;
      setPagado(pagado);

      // Crear un nuevo pago en el backend
      await axios.post('/pagos', {
        usuario: task.nombre + ' ' + task.apellido,
        monto: totalAdeudado,
        fecha: new Date(),
      });

      await updateTask(task._id, { ...task, pagado, ultimoPago: fecha });
      setUltimoPago(fecha);
      setShowForm(false); // Cerrar el formulario después de enviar
      calcularTotalAdeudado(nuevasFechasAdeudadas); // Actualizar el total adeudado
    } catch (error) {
      console.error('Error creando el pago:', error);
    }
  };

  const calcularFechasAdeudadas = (fechaInicioMembresia, ultimoPago) => {
    const fechaInicio = new Date(fechaInicioMembresia);
    const fechaActual = new Date();
    const fechas = [];

    if (!ultimoPago) {
      fechaInicio.setMonth(fechaInicio.getMonth() + 1);
    } else {
      fechaInicio.setTime(new Date(ultimoPago).getTime());
      fechaInicio.setMonth(fechaInicio.getMonth() + 1);
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

  const calcularTotalAdeudado = (fechas) => {
    let total = 0;
    fechas.forEach((fecha) => {
      const mesAno = `${fecha.getFullYear()}-${("0" + (fecha.getMonth() + 1)).slice(-2)}`;
      const precio = preciosHistoricos.find(p => {
        const fechaPrecio = new Date(p.fecha);
        return fechaPrecio.getFullYear() === fecha.getFullYear() && fechaPrecio.getMonth() === fecha.getMonth();
      });
      console.log(`Fecha: ${fecha.toLocaleDateString()}, Precio: ${precio ? precio.precio : 'No encontrado'}`); // Log para depuración
      total += precio ? precio.precio : 0;
    });
    setTotalAdeudado(total);
  };

  const calcularProximoPago = () => {
    if (fechasAdeudadas.length > 0) {
      const ultimoPago = fechasAdeudadas[fechasAdeudadas.length - 1];
      const proximoPagoDate = new Date(ultimoPago);
      proximoPagoDate.setMonth(proximoPagoDate.getMonth() + 1);
      setProximoPago(proximoPagoDate);
    } else if (ultimoPago) {
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
    console.log(`Intentando eliminar tarea con ID: ${task._id}`);
    await deleteTask(task._id);
  };

  const handleEditClick = () => {
    console.log("Edit clicked"); // Implementar lógica de edición aquí
  };

  const handleCloseForm = () => {
    setShowForm(false); // Manejar el cierre del formulario
  };

  const handlePagarTotalClick = async () => {
    setFechasAdeudadas([]);
    setPagado(true);
    await updateTask(task._id, { ...task, pagado: true, ultimoPago: new Date() });
    setUltimoPago(new Date());
    setShowForm(false);
    setTotalAdeudado(0);
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
            <ButtonLink>
              <FaCalendarCheck className="text-blue-500 cursor-pointer text-lg" onClick={handleAbonoClick} />
            </ButtonLink>
            <ButtonLink to={`/tasks/${task._id}`}>
              <FaEdit className="text-yellow-500 cursor-pointer text-lg" />
            </ButtonLink>
            <ButtonLink>
              <FaTrash className="text-red-500 cursor-pointer text-lg"  onClick={handleDeleteClick}/>
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
                <ul className="mb-4">
                  {fechasAdeudadas.map((fecha) => {
                    const mesAno = `${fecha.getFullYear()}-${("0" + (fecha.getMonth() + 1)).slice(-2)}`;
                    const precio = preciosHistoricos.find(p => {
                      const fechaPrecio = new Date(p.fecha);
                      return fechaPrecio.getFullYear() === fecha.getFullYear() && fechaPrecio.getMonth() === fecha.getMonth();
                    });
                    return (
                      <li key={fecha.toString()} className="mb-2">
                        <div className="flex justify-between items-center">
                          <span>{fecha.toLocaleDateString()} - ${precio ? precio.precio : 'No encontrado'}</span>
                          <Button
                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-lg"
                            onClick={() => handleFormSubmit(fecha)}
                          >
                            Pagar
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="mb-4">
                  <p className="text-white">Total adeudado: ${totalAdeudado}</p>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    className="text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-lg"
                    onClick={handlePagarTotalClick}
                  >
                    Pagar Total ${totalAdeudado}
                  </Button>
                  <Button
                    className="text-xs bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded-lg"
                    onClick={handleCloseForm}
                  >
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
