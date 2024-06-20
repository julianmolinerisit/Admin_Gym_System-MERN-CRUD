import axios from "./axios";

// Registers access by DNI
export const registrarAccesoRequest = async (dni) => {
  try {
    const response = await axios.put(`/acceso/${dni}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al registrar el acceso');
  }
};
