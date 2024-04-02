import { z } from "zod";

export const createTaskSchema = z.object({
  nombre: z.string().nonempty(),
  apellido: z.string().nonempty(),
  dni: z.string().nonempty(),
  fechaNacimiento: z.date(), // No es necesario agregar refinamientos aquí
  fechaInicioMembresia: z.date(), // No es necesario agregar refinamientos aquí
  comentarios: z.string().optional(),
});
