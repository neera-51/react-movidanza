// hooks/useProfesor.js
import api from "../../utils/api";

/**
 * Hook para manejar operaciones relacionadas con profesores.
 */
const useProfesor = () => {
  /** Obtener todos los profesores */
  const getAllProfesores = async () => {
    const response = await api.get('/profesor');
    return response.data;
  };

  /** Obtener un profesor por nombre */
  const getProfesorByNombre = async (nombre) => {
    const response = await api.get(`/profesor/nombre/${nombre}`);
    return response.data;
  };

  /** Obtener un profesor por ID */
  const getProfesorById = async (id) => {
    const response = await api.get(`/profesor/${id}`);
    return response.data;
  };

  /** Crear un nuevo profesor */
  const createProfesor = async (nuevoProfesor) => {
    const response = await api.post('/profesor', nuevoProfesor);
    return response.data;
  };

  /** Actualizar un profesor por ID */
  const updateProfesor = async (id, profesorActualizado) => {
    const response = await api.put(`/profesor/${id}`, profesorActualizado);
    return response.data;
  };

  /** Eliminar un profesor por ID */
  const deleteProfesor = async (id) => {
    const response = await api.delete(`/profesor/${id}`);
    return response.data;
  };

  return {
    getAllProfesores,
    getProfesorByNombre,
    getProfesorById,
    createProfesor,
    updateProfesor,
    deleteProfesor,
  };
};

export default useProfesor;
