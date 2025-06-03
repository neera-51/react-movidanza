// hooks/useHorario.js
import api from "../../utils/api";

/**
 * Hook para manejar operaciones relacionadas con horarios.
 */
const useHorario = () => {
  /** Obtiene todos los horarios */
  const getAllHorarios = async () => {
    const response = await api.get('/horario');
    return response.data;
  };

  /** Obtiene horarios por día de la semana */
  const getHorariosByDia = async (diaSemana) => {
    const response = await api.get(`/horario/dia/${diaSemana}`);
    return response.data;
  };

  /** Obtiene un horario por su ID */
  const getHorarioById = async (id) => {
    const response = await api.get(`/horario/${id}`);
    return response.data;
  };

  /** Crea un nuevo horario */
  const createHorario = async (newHorario) => {
    const response = await api.post('/horario', newHorario);
    return response.data;
  };

  /** Actualiza un horario por su ID */
  const updateHorario = async (id, updatedHorario) => {
    const response = await api.put(`/horario/${id}`, updatedHorario);
    return response.data;
  };

  /** Elimina un horario por su ID */
  const deleteHorario = async (id) => {
    const response = await api.delete(`/horario/${id}`);
    return response.data;
  };

  return {
    getAllHorarios,
    getHorariosByDia,
    getHorarioById,
    createHorario,
    updateHorario,
    deleteHorario,
  };
};

export default useHorario;
