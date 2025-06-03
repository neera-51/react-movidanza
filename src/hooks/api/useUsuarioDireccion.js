// hooks/useUsuarioDireccion.js
import api from "../../utils/api";

/**
 * Hook para manejar operaciones relacionadas con direcciones de usuario.
 */
const useUsuarioDireccion = () => {
  /** Obtener todas las direcciones de usuario */
  const getAllUsuarioDirecciones = async () => {
    const response = await api.get('/usuariodireccion');
    return response.data;
  };

  /** Obtener direcciones por ID de usuario */
  const getUsuarioDireccionByUsuarioId = async (idUsuario) => {
    const response = await api.get(`/usuariodireccion/usuario/${idUsuario}`);
    return response.data;
  };

  /** Obtener una dirección de usuario por ID */
  const getUsuarioDireccionById = async (id) => {
    const response = await api.get(`/usuariodireccion/${id}`);
    return response.data;
  };

  /** Crear una nueva dirección de usuario */
  const createUsuarioDireccion = async (nuevaDireccion) => {
    const response = await api.post('/usuariodireccion', nuevaDireccion);
    return response.data;
  };

  /** Actualizar una dirección de usuario por ID */
  const updateUsuarioDireccion = async (id, direccionActualizada) => {
    const response = await api.put(`/usuariodireccion/${id}`, direccionActualizada);
    return response.data;
  };

  /** Eliminar una dirección de usuario por ID */
  const deleteUsuarioDireccion = async (id) => {
    const response = await api.delete(`/usuariodireccion/${id}`);
    return response.data;
  };

  return {
    getAllUsuarioDirecciones,
    getUsuarioDireccionByUsuarioId,
    getUsuarioDireccionById,
    createUsuarioDireccion,
    updateUsuarioDireccion,
    deleteUsuarioDireccion,
  };
};

export default useUsuarioDireccion;
