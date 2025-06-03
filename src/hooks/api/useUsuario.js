// hooks/useUsuario.js
import api from "../../utils/api";

/**
 * Hook para manejar operaciones relacionadas con usuarios.
 */
const useUsuario = () => {
  /** Obtener todos los usuarios */
  const getAllUsuarios = async () => {
    const response = await api.get('/usuario');
    return response.data;
  };

  /** Obtener un usuario por ID */
  const getUsuarioById = async (id) => {
    const response = await api.get(`/usuario/${id}`);
    return response.data;
  };

  /** Crear un nuevo usuario */
  const createUsuario = async (nuevoUsuario) => {
    const response = await api.post('/usuario', nuevoUsuario);
    return response.data;
  };

  /** Actualizar un usuario por ID */
  const updateUsuario = async (id, usuarioActualizado) => {
    const response = await api.put(`/usuario/${id}`, usuarioActualizado);
    return response.data;
  };

  /** Eliminar un usuario por ID */
  const deleteUsuario = async (id) => {
    const response = await api.delete(`/usuario/${id}`);
    return response.data;
  };

  return {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
  };
};

export default useUsuario;
