import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Input, Label } from "../components/ui";
import { useTasks } from "../context/tasksContext";
import { Textarea } from "../components/ui/Textarea";
import { useForm } from "react-hook-form";

export function TaskFormPage() {
  const { getTask, updateTask, createTask } = useTasks(); // Importa createTask desde useTasks
  const navigate = useNavigate();
  const params = useParams();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const loadTask = async () => {
      try {
        if (params.id) {
          const task = await getTask(params.id);
          console.log("Datos de tarea obtenidos:", task); // Agregar este console.log
          setValue("nombre", task.nombre);
          setValue("apellido", task.apellido);
          setValue("dni", task.dni);
          setValue("fechaNacimiento", task.fechaNacimiento);
          setValue("fechaInicioMembresia", task.fechaInicioMembresia);
          setValue("comentarios", task.comentarios);
        }
      } catch (error) {
        console.error("Error al cargar la tarea:", error);
      }
    };
    loadTask();
  }, [params.id]);

  const onSubmit = async (data) => {
    try {
      console.log("Datos de tarea enviados al servidor:", data);

      if (!params.id) {
        data.ultimoIngreso = new Date().toISOString().split("T")[0];
        data.pagado = false;
      }

      if (params.id) {
        await updateTask(params.id, data);
      } else {
        await createTask(data); // Utiliza la función createTask
      }
      navigate("/tasks");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };


  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>{params.id ? "Editar Usuario en el Gimnasio" : "Alta de Usuario en el Gimnasio"}</h1>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          type="text"
          name="nombre"
          placeholder="Nombre"
          {...register("nombre", { required: true })}
          autoFocus
        />
        {errors.nombre && (
          <p className="text-red-500 text-xs italic">Por favor ingresa un nombre.</p>
        )}

        <Label htmlFor="apellido">Apellido</Label>
        <Input
          type="text"
          name="apellido"
          placeholder="Apellido"
          {...register("apellido")}
        />

        <Label htmlFor="dni">DNI</Label>
        <Input
          type="text"
          name="dni"
          placeholder="DNI"
          {...register("dni")}
        />

        <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
        <Input type="date" name="fechaNacimiento" {...register("fechaNacimiento")} />

        <Label htmlFor="fechaInicioMembresia">Fecha de Inicio de Membresía</Label>
        <Input type="date" name="fechaInicioMembresia" {...register("fechaInicioMembresia")} />

        <Label htmlFor="comentarios">Comentarios</Label>
        <Textarea
          name="comentarios"
          id="comentarios"
          rows="3"
          placeholder="Comentarios"
          {...register("comentarios")}
        ></Textarea>

        <Button type="submit">{params.id ? "Guardar Cambios" : "Guardar"}</Button>
      </form>
    </Card>
  );
}
