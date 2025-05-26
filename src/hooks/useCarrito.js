// hooks/useCarrito.js
import api from '../utils/api';

/**
 * Hook para manejar operaciones relacionadas con carritos.
 */
const useCarrito = () => {
  /** Obtiene todos los carritos */
  const getAllCarritos = async () => {
    const response = await api.get('/carrito');
    return response.data;
  };

  /** Obtiene carritos por ID de usuario */
  const getCarritosByIdUsuario = async (id_usuario) => {
    const response = await api.get(`/carrito/usuario/${id_usuario}`);
    return response.data;
  };

  /** Obtiene un carrito por su ID */
  const getCarritoById = async (id) => {
    const response = await api.get(`/carrito/${id}`);
    return response.data;
  };

  /** Crea un nuevo carrito */
  const createCarrito = async (newCarrito) => {
    const response = await api.post('/carrito', newCarrito);
    return response.data;
  };

  /** Actualiza un carrito por su ID */
  const updateCarrito = async (id, updatedCarrito) => {
    const response = await api.put(`/carrito/${id}`, updatedCarrito);
    return response.data;
  };

  /** Elimina un carrito por su ID */
  const deleteCarrito = async (id) => {
    const response = await api.delete(`/carrito/${id}`);
    return response.data;
  };

  return {
    getAllCarritos,
    getCarritosByIdUsuario,
    getCarritoById,
    createCarrito,
    updateCarrito,
    deleteCarrito,
  };
};

export default useCarrito;
