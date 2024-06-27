import axios from "./axios";

// Fetches all tasks
export const getTasksRequest = async () => axios.get("/tasks");

// Creates a new task
export const createTaskRequest = async (task) => axios.post("/tasks", task);

// Updates an existing task by ID
export const updateTaskRequest = async (id, task) => axios.put(`/tasks/${id}`, task);

// Deletes a task by ID
export const deleteTaskRequest = async (id) => axios.delete(`/tasks/${id}`);

// Fetches a task by ID
export const getTaskRequest = async (id) => axios.get(`/tasks/${id}`);

// Finds a task by DNI
export const findTaskByDNIRequest = async (dni) => axios.get(`/tasks/dni/${dni}`);

// Updates the monthly price
export const updatePrecioMensualRequest = async (precioMensual) => axios.put('/precios', { precioMensual });

// Fetches the most recent monthly price
export const getPrecioMensualRequest = async () => axios.get('/precios');

// Deletes a price by ID
export const deletePriceRequest = async (id) => axios.delete(`/precios/${id}`);

// Fetches all prices
export const getPricesRequest = async () => axios.get('/precios');

// Creates a new price
export const addPriceRequest = async (precio) => axios.post('/precios', { precio });

// Updates an existing price by ID
export const updatePriceRequest = async (id, precio) => axios.put(`/precios/${id}`, { precio });

// Fetches price evolution
export const getPriceEvolutionRequest = async () => axios.get('/precios/evolution'); // Ajuste en la ruta

// Fetches all payments
export const getPaymentsRequest = async () => axios.get('/pagos');

// Creates a new payment
export const addPaymentRequest = async (monto, usuario) => axios.post('/pagos', { monto, usuario });

