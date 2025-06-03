// hooks/useCategoria.js
import api from '../../utils/api';

/**
 * Hook para manejar operaciones relacionadas con categorías.
 */
const useCategoria = () => {
  /** Obtiene todas las categorías */
  const getAllCategorias = async () => {
    const response = await api.get('/categoria');
    return response.data;
  };

  /** Obtiene las categorías padre */
  const getCategoriasPadre = async () => {
    const response = await api.get('/categoria/categorias_padre');
    return response.data;
  };

  /** Obtiene las categorías hijo */
  const getCategoriasHijo = async () => {
    const response = await api.get('/categoria/categorias_hijo');
    return response.data;
  };

  /** Obtiene categorías por ID de categoría padre */
  const getCategoriasByIdPadre = async (id_padre) => {
    const response = await api.get(`/categoria/id_padre/${id_padre}`);
    return response.data;
  };

  /** Obtiene una categoría por su ID */
  const getCategoriaById = async (id) => {
    const response = await api.get(`/categoria/${id}`);
    return response.data;
  };

  /** Crea una nueva categoría */
  const createCategoria = async (newCategoria) => {
    const response = await api.post('/categoria', newCategoria);
    return response.data;
  };

  /** Actualiza una categoría por su ID */
  const updateCategoria = async (id, updatedCategoria) => {
    const response = await api.put(`/categoria/${id}`, updatedCategoria);
    return response.data;
  };

  /** Elimina una categoría por su ID */
  const deleteCategoria = async (id) => {
    const response = await api.delete(`/categoria/${id}`);
    return response.data;
  };

  return {
    getAllCategorias,
    getCategoriasPadre,
    getCategoriasHijo,
    getCategoriasByIdPadre,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria,
  };
};

export default useCategoria;
