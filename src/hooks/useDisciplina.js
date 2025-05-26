// hoooks/useDisciplina.js
import api from '../utils/api';
/**
 * Hook para manejar operaciones relacionadas con disciplinas.
 */

const useDisciplina = () => {
    /** Obtiene todas las disciplinas */
    const getAllDisciplinas = async () => {
        const response = await api.get('/disciplina');
        return response.data;
    };

    /** Obtiene una disciplina por su ID */
    const getDisciplinaById = async (id) => {
        const response = await api.get(`/disciplina/${id}`);
        return response.data;
    };
    
    /** Obtiene una disciplina por su nombre */
    const getDisciplinaByNombre = async (nombre) => {
        const response = await api.get(`/disciplina/nombre/${nombre}`);
        return response.data;
    };

    /** Crea una nueva disciplina */
    const createDisciplina = async (newDisciplina) => {
        const response = await api.post('/disciplina', newDisciplina);
        return response.data;
    };

    /** Actualiza una disciplina por su ID */
    const updateDisciplina = async (id, updatedDisciplina) => {
        const response = await api.put(`/disciplina/${id}`, updatedDisciplina);
        return response.data;
    };

    /** Elimina una disciplina por su ID */
    const deleteDisciplina = async (id) => {
        const response = await api.delete(`/disciplina/${id}`);
        return response.data;
    };


    return {
        getAllDisciplinas,
        getDisciplinaById,
        getDisciplinaByNombre,
        createDisciplina,
        updateDisciplina,
        deleteDisciplina,
    };
}
export default useDisciplina;