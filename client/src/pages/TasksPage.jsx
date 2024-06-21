import React, { useState, useEffect } from "react";
import { useTasks } from "../context/tasksContext";
import { TaskCard } from "../components/tasks/TaskCard";
import { ImFileEmpty } from "react-icons/im";
import { FaTable, FaTh } from "react-icons/fa"; // Importar íconos
import { Button, ButtonLink } from "../components/ui"; // Asegurarnos de importar Button y ButtonLink

export function TasksPage() {
  const { tasks, getTasks } = useTasks();
  const [searchDNI, setSearchDNI] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (Array.isArray(tasks)) {
      if (searchDNI.trim() === "") {
        setFilteredTasks(tasks);
      } else {
        setFilteredTasks(tasks.filter((task) => task.dni.includes(searchDNI)));
      }
    }
  }, [tasks, searchDNI]);

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <input
          type="text"
          placeholder="Buscar por DNI"
          value={searchDNI}
          onChange={(e) => setSearchDNI(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
        />
        <div>
        <button onClick={() => setViewMode("table")} className="mr-2">
        <FaTable />
          </button>
          <button onClick={() => setViewMode("card")}>
            <FaTh />
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 border border-gray-500">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-white">Nombre</th>
                <th className="py-2 px-4 border-b text-white">Apellido</th>
                <th className="py-2 px-4 border-b text-white">DNI</th>
                <th className="py-2 px-4 border-b text-white">
                  Fecha de Nacimiento
                </th>
                <th className="py-2 px-4 border-b text-white">
                  Último Ingreso
                </th>
                <th className="py-2 px-4 border-b text-white">Próximo Pago</th>
                <th className="py-2 px-4 border-b text-white">Comentarios</th>
                <th className="py-2 px-4 border-b text-white">Estado</th>
                <th className="py-2 px-4 border-b text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-400">
                    <ImFileEmpty className="text-6xl mx-auto" />
                    <p className="mt-4 text-lg text-gray-400">
                      No hay registros disponibles
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="p-4 bg-gray-200 rounded-md shadow-md"
            >
              <h2 className="font-bold">
                {task.nombre} {task.apellido}
              </h2>
              <p>DNI: {task.dni}</p>
              <p>Fecha de Nacimiento: {task.fechaNacimiento}</p>
              <p>Último Ingreso: {task.ultimoIngreso}</p>
              <p>
                Próximo Pago:{" "}
                {task.proximoPago
                  ? task.proximoPago.toLocaleDateString()
                  : "N/A"}
              </p>
              <p
                className={`inline-block px-2 py-1 rounded-full text-white ${
                  task.pagado ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {task.pagado ? "Pagado" : "Adeuda pagos"}
              </p>
              <div className="flex space-x-2">
                <Button onClick={() => handleAbonoClick(task)}>
                  Registrar Pago
                </Button>
                <ButtonLink to={`/tasks/${task._id}`}>Editar</ButtonLink>
                <Button onClick={() => handleDeleteClick(task._id)}>
                  Eliminar
                </Button>
              </div>
              {task.showForm && (
                <div>
                  <h3>Fechas adeudadas:</h3>
                  {task.fechasAdeudadas.map((fecha) => (
                    <div key={fecha}>
                      <span>{fecha.toLocaleDateString()}</span>
                      <Button onClick={() => handleFormSubmit(fecha, task._id)}>
                        Pagar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
