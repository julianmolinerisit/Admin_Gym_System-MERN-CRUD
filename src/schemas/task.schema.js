import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
});



export const getTaskSchema = z.object({
  id: z.string().min(1).max(255), // Se espera que el ID de la tarea esté presente en la solicitud GET
});
