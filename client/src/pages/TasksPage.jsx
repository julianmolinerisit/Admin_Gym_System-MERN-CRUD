import React, { useState, useEffect } from "react";
import { useTasks } from "../context/tasksContext";
import { TaskCard } from "../components/tasks/TaskCard";
import { ImFileEmpty } from "react-icons/im";
import { FaTable, FaTh, FaFileDownload } from "react-icons/fa"; // Importar íconos
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function TasksPage() {
  const { tasks, getTasks } = useTasks();
  const [searchDNI, setSearchDNI] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    filterTasksBySearch();
  }, [tasks, searchDNI]);

  // Función para filtrar tareas por búsqueda de DNI
  const filterTasksBySearch = () => {
    if (Array.isArray(tasks)) {
      if (searchDNI.trim() === "") {
        setFilteredTasks(tasks);
      } else {
        setFilteredTasks(tasks.filter((task) => task.dni.includes(searchDNI)));
      }
    }
  };

  // Función para filtrar tareas por opción seleccionada (recientes, viejos, deudores)
  const filterTasks = (filterType) => {
    switch (filterType) {
      case "recientes":
        setFilteredTasks([...tasks].sort((a, b) => new Date(b.fechaInicioMembresia) - new Date(a.fechaInicioMembresia)));
        break;
      case "viejos":
        setFilteredTasks([...tasks].sort((a, b) => new Date(a.fechaInicioMembresia) - new Date(b.fechaInicioMembresia)));
        break;
      case "deudores":
        setFilteredTasks(tasks.filter(task => !task.pagado));
        break;
      default:
        setFilteredTasks(tasks);
        break;
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(workbook, "tasks.xlsx");
  };

  const exportToPDF = () => {
    const input = document.getElementById("tasks-table");
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("tasks.pdf");
      });
  };

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
          <button onClick={exportToExcel} className="ml-2">
            Excel
          </button>
          <button onClick={exportToPDF} className="ml-2">
             PDF
          </button>
        </div>
      </div>

      <div className="flex justify-end p-4">
        <button onClick={() => filterTasks("recientes")} className="mx-2 px-4 py-2 bg-gray-700 text-white rounded">
          Recientes
        </button>
        <button onClick={() => filterTasks("viejos")} className="mx-2 px-4 py-2 bg-gray-700 text-white rounded">
          Anteriores
        </button>
        <button onClick={() => filterTasks("deudores")} className="mx-2 px-4 py-2 bg-gray-700 text-white rounded">
          Impagos
        </button>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table id="tasks-table" className="min-w-full bg-gray-700 border border-gray-500">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-white">Nombre</th>
                <th className="py-2 px-4 border-b text-white">Apellido</th>
                <th className="py-2 px-4 border-b text-white">DNI</th>
                <th className="py-2 px-4 border-b text-white">Fecha de Nacimiento</th>
                <th className="py-2 px-4 border-b text-white">Fecha de Inicio</th>
                <th className="py-2 px-4 border-b text-white">Último Pago</th>
                <th className="py-2 px-4 border-b text-white">Próximo Pago</th>
                <th className="py-2 px-4 border-b text-white">Último Ingreso</th>
                <th className="py-2 px-4 border-b text-white">Comentarios</th>
                <th className="py-2 px-4 border-b text-white">Estado</th>
                <th className="py-2 px-4 border-b text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-4 text-gray-400">
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
              className="p-4 bg-gray-700 rounded-md shadow-md ml-2"
            >
              <h2 className="font-bold">
                {task.nombre} {task.apellido}
              </h2>
              <p>DNI: {task.dni}</p>
              <p>Fecha de Inicio: {new Date(task.fechaInicioMembresia).toLocaleDateString()}</p>
              <p>Último Pago: {task.ultimoPago ? new Date(task.ultimoPago).toLocaleDateString() : "N/A"}</p>
              <p>Último Ingreso: {task.ultimoIngreso ? new Date(task.ultimoIngreso).toLocaleDateString() : "N/A"}</p>
              <p
                className={`my-2 inline-block px-2 py-1 rounded-full text-white ${
                  task.pagado ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {task.pagado ? "Pagado" : "Adeuda pagos"}
              </p>
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
