import React, { useState, useEffect } from "react";
import { useTasks } from "../context/tasksContext";
import { TaskCard } from "../components/tasks/TaskCard";
import { ImFileEmpty } from "react-icons/im";

export function TasksPage() {
  const { tasks, getTasks } = useTasks();
  const [searchDNI, setSearchDNI] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (searchDNI.trim() === "") {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) =>
        task.dni.toLowerCase().includes(searchDNI.toLowerCase().trim())
      );
      setFilteredTasks(filtered);
    }
  }, [searchDNI, tasks]);

  return (
    <>
      <div className="flex justify-center items-center p-4">
        <input
          type="text"
          placeholder="Buscar por DNI"
          value={searchDNI}
          onChange={(e) => setSearchDNI(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white" // Añadir estilos para texto negro y fondo blanco
        />
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex justify-center items-center p-10">
          <div>
            <ImFileEmpty className="text-6xl text-gray-400 m-auto my-2" />
            <h1 className="font-bold text-xl">No hay registros encontrados.</h1>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredTasks.map((task) => (
            <TaskCard task={task} key={task._id} />
          ))}
        </div>
      )}
    </>
  );
}
