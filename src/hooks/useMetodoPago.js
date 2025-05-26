// hooks/useMetodoPago.js
import api from "../utils/api";

/**
 * Hook para manejar operaciones relacionadas con métodos de pago.
 */
const useMetodoPago = () => {
  /** Obtiene todos los métodos de pago */
  const getAllMetodosPago = async () => {
    const response = await api.get('/metodopago');
    return response.data;
  };

  /** Obtiene métodos de pago por ID de usuario */
  const getMetodoPagoByIdUsuario = async (idUsuario) => {
    const response = await api.get(`/metodopago/usuario/${idUsuario}`);
    return response.data;
  };

  /** Obtiene un método de pago por su ID */
  const getMetodoPagoById = async (id) => {
    const response = await api.get(`/metodopago/${id}`);
    return response.data;
  };

  /** Crea un nuevo método de pago */
  const createMetodoPago = async (nuevoMetodoPago) => {
    console.log("Creando nuevo método de pago:", nuevoMetodoPago);
    const response = await api.post('/metodopago', nuevoMetodoPago);
    return response.data;
  };

  /** Actualiza un método de pago por su ID */
  const updateMetodoPago = async (id, datosActualizados) => {
    console.log(`Actualizando método de pago con ID: ${id} y datos: ${JSON.stringify(datosActualizados)}`);
    const response = await api.put(`/metodopago/${id}`, datosActualizados);
    console.log("Respuesta de la API:", response.data);
    return response.data;
  };

  /** Elimina un método de pago por su ID */
  const deleteMetodoPago = async (id) => {
    const response = await api.delete(`/metodopago/${id}`);
    return response.data;
  };

  return {
    getAllMetodosPago,
    getMetodoPagoByIdUsuario,
    getMetodoPagoById,
    createMetodoPago,
    updateMetodoPago,
    deleteMetodoPago,
  };
};

export default useMetodoPago;
