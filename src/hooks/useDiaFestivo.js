// hooks/useDiaFestivo.js
import api from '../utils/api';

/**
 * Hook para manejar operaciones relacionadas con días festivos.
 */
const useDiaFestivo = () => {
    /** Obtiene todos los días festivos */
    const getAllDiasFestivos = async () => {
        const response = await api.get('/dia_festivo');
        return response.data;
    };

    /** Obtiene un día festivo por su ID */
    const getDiaFestivoById = async (id) => {
        const response = await api.get(`/dia_festivo/${id}`);
        return response.data;
    };

    /** Obtiene un día festivo por su fecha */
    const getDiaFestivoByFecha = async (fecha) => {
        const response = await api.get(`/dia_festivo/fecha/${fecha}`);
        return response.data;
    };

    /** Obtiene días festivos por motivo */
    const getDiaFestivoByMotivo = async (motivo) => {
        const response = await api.get(`/dia_festivo/motivo/${motivo}`);
        return response.data;
    };

    /** Obtiene días festivos por año */
    const getDiaFestivoByAnio = async (anio) => {
        const response = await api.get(`/dia_festivo/anio/${anio}`);
        return response.data;
    };

    /** Obtiene días festivos por mes */
    const getDiaFestivoByMes = async (mes) => {
        const response = await api.get(`/dia_festivo/mes/${mes}`);
        return response.data;
    };

    /** Crea un nuevo día festivo */
    const createDiaFestivo = async (newDiaFestivo) => {
        const response = await api.post('/dia_festivo', newDiaFestivo);
        return response.data;
    };

    /** Actualiza un día festivo por su ID */
    const updateDiaFestivo = async (id, updatedDiaFestivo) => {
        const response = await api.put(`/dia_festivo/${id}`, updatedDiaFestivo);
        return response.data;
    };

    /** Elimina un día festivo por su ID */
    const deleteDiaFestivo = async (id) => {
        const response = await api.delete(`/dia_festivo/${id}`);
        return response.data;
    };

    return {
        getAllDiasFestivos,
        getDiaFestivoById,
        getDiaFestivoByFecha,
        getDiaFestivoByMotivo,
        getDiaFestivoByAnio,
        getDiaFestivoByMes,
        createDiaFestivo,
        updateDiaFestivo,
        deleteDiaFestivo,
    };
};

export default useDiaFestivo;
