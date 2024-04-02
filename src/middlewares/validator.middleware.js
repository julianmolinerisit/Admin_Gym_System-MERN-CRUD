export const validateSchema = (schema) => (req, res, next) => {
	try {
		schema.parse(req.body);
		next();
	} catch (error) {
		return res
			.status(400)
			.json({ message: error.errors.map((err) => err.message) });
	}
};


import { getTaskSchema } from '../schemas/task.schema.js';

export const validateGetTaskSchema = (req, res, next) => {
  const { id } = req.params; // Suponiendo que el ID de la tarea está en los parámetros de la URL

  try {
    getTaskSchema.parse({ id });
    next();
  } catch (error) {
    return res.status(400).json({ message: error.errors });
  }
};
