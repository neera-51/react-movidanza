// hooks/useCarritoProducto.js

import api from "../../utils/api";

/**
 * Hook para manejar operaciones relacionadas con los productos del carrito.
 */
const useCarritoProducto = () => {

  /** Obtiene todos los productos del carrito */
  const getAllCarritoProducto = async () => {
    const response = await api.get('/carritoproducto');
    return response.data;
  };

  /** Obtiene productos por ID de carrito */
  const getCarritoProductoByIdCarrito = async (id_carrito) => {
    const response = await api.get(`/carritoproducto/carrito/${id_carrito}`);
    return response.data;
  };

  /** Obtiene un producto del carrito por su ID */
  const getCarritoProductoById = async (id) => {
    const response = await api.get(`/carritoproducto/${id}`);
    return response.data;
  };

  /** Crea un nuevo producto en el carrito */
  const createCarritoProducto = async (newRecord) => {
    const response = await api.post('/carritoproducto', newRecord);
    return response.data;
  };

  /** Actualiza un producto del carrito por su ID */
  const updateCarritoProducto = async (id, updatedRecord) => {
    const response = await api.put(`/carritoproducto/${id}`, updatedRecord);
    return response.data;
  };

  /** Elimina un producto del carrito por su ID */
  const deleteCarritoProducto = async (id) => {
    const response = await api.delete(`/carritoproducto/${id}`);
    return response.data;
  };

  return {
    getAllCarritoProducto,
    getCarritoProductoByIdCarrito,
    getCarritoProductoById,
    createCarritoProducto,
    updateCarritoProducto,
    deleteCarritoProducto
  };

};

export default useCarritoProducto;
