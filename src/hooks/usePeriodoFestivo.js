// hooks/usePeriodoFestivo.js
import api from "../utils/api";

/**
 * Hook para manejar operaciones relacionadas con periodos festivos.
 */
const usePeriodoFestivo = () => {

  /** Obtener todos los periodos festivos */
  const getAllPeriodosFestivos = async () => {
    const response = await api.get('/periodo_festivo');
    return response.data;
  };

  /** Obtener un periodo festivo por ID */
  const getPeriodoFestivoById = async (id) => {
    const response = await api.get(`/periodo_festivo/${id}`);
    return response.data;
  };

  /** Obtener periodos festivos por fecha */
  const getPeriodosFestivosPorFecha = async (fecha) => {
    const response = await api.get(`/periodo_festivo/fecha/${fecha}`);
    return response.data;
  };

  /** Obtener periodos festivos por año */
  const getPeriodosFestivosPorAnio = async (anio) => {
    const response = await api.get(`/periodo_festivo/anio/${anio}`);
    return response.data;
  };

  /** Obtener periodos festivos por mes */
  const getPeriodosFestivosPorMes = async (mes) => {
    const response = await api.get(`/periodo_festivo/mes/${mes}`);
    return response.data;
  };

  /** Obtener periodos festivos por motivo */
  const getPeriodosFestivosByMotivo = async (motivo) => {
    const response = await api.get(`/periodo_festivo/motivo/${motivo}`);
    return response.data;
  };

  /** Crear un nuevo periodo festivo */
  const createPeriodoFestivo = async (nuevoPeriodoFestivo) => {
    const response = await api.post('/periodo_festivo', nuevoPeriodoFestivo);
    return response.data;
  };

  /** Actualizar un periodo festivo por ID */
  const updatePeriodoFestivo = async (id, dataActualizada) => {
    const response = await api.put(`/periodo_festivo/${id}`, dataActualizada);
    return response.data;
  };

  /** Eliminar un periodo festivo por ID */
  const deletePeriodoFestivo = async (id) => {
    const response = await api.delete(`/periodo_festivo/${id}`);
    return response.data;
  };

  return {
    getAllPeriodosFestivos,
    getPeriodoFestivoById,
    getPeriodosFestivosPorFecha,
    getPeriodosFestivosPorAnio,
    getPeriodosFestivosPorMes,
    getPeriodosFestivosByMotivo,
    createPeriodoFestivo,
    updatePeriodoFestivo,
    deletePeriodoFestivo,
  };
};

export default usePeriodoFestivo;
