// hooks/useDireccion.js
import api from '../utils/api';

/**
 * Hook para manejar operaciones relacionadas con direcciones.
 */
const useDireccion = () => {
    /** Obtiene todas las direcciones */
    const getAllDirecciones = async () => {
        const response = await api.get('/direccion');
        return response.data;
    };

    /** Obtiene una dirección por su ID */
    const getDireccionById = async (id) => {
        const response = await api.get(`/direccion/${id}`);
        return response.data;
    };

    /** Crea una nueva dirección */
    const createDireccion = async (newDireccion) => {
        const response = await api.post('/direccion', newDireccion);
        return response.data;
    };

    /** Actualiza una dirección por su ID */
    const updateDireccion = async (id, updatedDireccion) => {
        const response = await api.put(`/direccion/${id}`, updatedDireccion);
        return response.data;
    };

    /** Elimina una dirección por su ID */
    const deleteDireccion = async (id) => {
        const response = await api.delete(`/direccion/${id}`);
        return response.data;
    };

    return {
        getAllDirecciones,
        getDireccionById,
        createDireccion,
        updateDireccion,
        deleteDireccion,
    };

}
export default useDireccion;