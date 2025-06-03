// hooks/useProducto.js
import api from "../../utils/api";

/**
 * Hook para manejar operaciones relacionadas con productos.
 */
const useProducto = () => {

  /** Obtener todos los productos */
  const getAllProductos = async () => {
    const response = await api.get('/producto');
    return response.data;
  };

  /** Obtener productos por categoría */
  const getProductosByCategoria = async (idCategoria) => {
    const response = await api.get(`/producto/categoria/${idCategoria}`);
    return response.data;
  };

  /** Obtener un producto por su nombre */
  const getProductosByNombre = async (nombre) => {
    const response = await api.get(`/producto/nombre/${nombre}`);
    return response.data;
  };

  /** Obtener un producto por ID */
  const getProductoById = async (id) => {
    const response = await api.get(`/producto/${id}`);
    return response.data;
  };

  /** Crear un nuevo producto */
  const createProducto = async (nuevoProducto) => {
    const response = await api.post('/producto', nuevoProducto);
    return response.data;
  };

  /** Actualizar un producto por ID */
  const updateProducto = async (id, productoActualizado) => {
    const response = await api.put(`/producto/${id}`, productoActualizado);
    return response.data;
  };

  /** Eliminar un producto por ID */
  const deleteProducto = async (id) => {
    const response = await api.delete(`/producto/${id}`);
    return response.data;
  };

  return {
    getAllProductos,
    getProductosByCategoria,
    getProductosByNombre,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
  };
};

export default useProducto;
