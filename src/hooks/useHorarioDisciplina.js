// hooks/useHorarioDisciplina.js
import api from "../utils/api";

/** 
 * Hook para manejar las operaciones relacionadas con los horarios y las disciplinas
 */
const useHorarioDisciplina = () => {

  /** Obtiene todas las disciplinas y sus horarios */
  const getAllHorarioDisciplina = async () => {
    const response = await api.get('/horariodisciplina');
    return response.data;
  };

  /** Obtiene la disciplina y horario por ID */
  const getHorarioDisciplinaById = async (id) => {
    const response = await api.get(`/horariodisciplina/${id}`);
    return response.data;
  };

  /** Crea una nueva relación entre disciplina y horario */
  const createHorarioDisciplina = async (newData) => {
    const response = await api.post('/horariodisciplina', newData);
    return response.data;
  };

  /** Actualiza un registro por ID */
  const updateHorarioDisciplina = async (id, updatedData) => {
    const response = await api.put(`/horariodisciplina/${id}`, updatedData);
    return response.data;
  };

  /** Elimina un registro por ID */
  const deleteHorarioDisciplina = async (id) => {
    const response = await api.delete(`/horariodisciplina/${id}`);
    return response.data;
  };

  return {
    getAllHorarioDisciplina,
    getHorarioDisciplinaById,
    createHorarioDisciplina,
    updateHorarioDisciplina,
    deleteHorarioDisciplina,
  };
};

export default useHorarioDisciplina;
