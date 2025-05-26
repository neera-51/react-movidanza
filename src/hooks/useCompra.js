// hooks/useCompra.js
import api from '../utils/api';

/** 
 * Hook para manejar operaciones relacionadas con compras 
 */

const useCompra = () => {
    /** Obtiene todas las compras */
    const getAllCompras = async () => {
        const response = await api.get('/compra');
        return response.data;
    };

    /** Obtiene una compra por su ID */
    const getCompraById = async (id) => {
        const response = await api.get(`/compra/${id}`);
        return response.data;
    };

    /** Obtiene compras por ID de usuario */
    const getComprasByIdUsuario = async (id_usuario) => {
        const response = await api.get(`/compra/id_usuario/${id_usuario}`);
        return response.data;
    }

    /** Crea una nueva compra */
    const createCompra = async (newCompra) => {
        const response = await api.post('/compra', newCompra);
        return response.data;
    };

    /** Actualiza una compra por su ID */
    const updateCompra = async (id, updatedCompra) => {
        const response = await api.put(`/compra/${id}`, updatedCompra);
        return response.data;
    };

    /** Elimina una compra por su ID */
    const deleteCompra = async (id) => {
        const response = await api.delete(`/compra/${id}`);
        return response.data;
    };

    return {
        getAllCompras,
        getCompraById,
        getComprasByIdUsuario,
        createCompra,
        updateCompra,
        deleteCompra,
    };
}

export default useCompra;