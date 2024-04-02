import { z } from "zod";

export const createTaskSchema = z.object({
  nombre: z.string({
    required_error: "Nombre is required",
  }),
  apellido: z.string({
    required_error: "Apellido is required",
  }),
  dni: z.string({
    required_error: "DNI is required",
  }),
  fechaNacimiento: z.date({
    required_error: "Fecha de Nacimiento is required",
  }),
  fechaInicioMembresia: z.date({
    required_error: "Fecha de Inicio de Membresía is required",
  }),
  comentarios: z.string().optional(),
  ultimoIngreso: z.date().nullable(),
});
