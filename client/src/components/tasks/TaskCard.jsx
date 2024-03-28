import { useTasks } from "../../context/tasksContext";
import { Button, ButtonLink, Card } from "../ui";

export function TaskCard({ task }) {
  const { deleteTask } = useTasks();

  // Función para calcular la fecha del próximo pago y la alerta
  // Función para calcular la fecha del próximo pago y la alerta
const calcularProximoPago = (fechaInicioMembresia) => {
  const fechaInicio = new Date(fechaInicioMembresia);
  const fechaActual = new Date();
  const unaSemana = 7 * 24 * 60 * 60 * 1000; // Milisegundos en una semana

  // Se calcula la fecha del próximo pago sumando un mes a la fecha de inicio de membresía
  const fechaProximoPago = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + 1, fechaInicio.getDate());
  const fechaAlerta = new Date(fechaProximoPago.getTime() - unaSemana);

  return { fechaProximoPago, fechaAlerta };
};

  const { fechaProximoPago, fechaAlerta } = calcularProximoPago(task.fechaInicioMembresia);

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
        {/* El edit no funciona. */}

        </div>
      </header>
      <p>
        Fecha de Nacimiento:{" "}
        {task.fechaNacimiento &&
          new Date(task.fechaNacimiento).toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
      </p>
      <p>
        Fecha de alta de cuenta:{" "}
        {task.fechaInicioMembresia &&
          new Date(task.fechaInicioMembresia).toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
      </p>
      <p>
        Próximo pago:{" "}
        {fechaProximoPago &&
          fechaProximoPago.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
      </p>
      {fechaAlerta && fechaAlerta.getTime() <= new Date().getTime() && (
        <p className="text-red-500">¡Alerta! Próximo pago debe realizarse en una semana.</p>
      )}
      <p>{task.comentarios}</p>
    </Card>
  );
}
