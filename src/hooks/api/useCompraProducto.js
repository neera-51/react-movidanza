// hooks/useCompraProducto.js

import api from '../../utils/api';
/**
 * Hook para manejar operaciones relacionadas con compras de productos.
 */

const useCompraProducto = () => {
    /** Obtiene todos los productos de compra */
    const getAllCompraProductos = async () => {
        const response = await api.get('/compraproducto');
        return response.data;
    };

    /** Obtiene un producto de compra por su ID */
    const getCompraProductoById = async (id) => {
        const response = await api.get(`/compraproducto/${id}`);
        return response.data;
    };

        /** Obtiene productos de compra por ID de compra */
    const getCompraProductoByIdCompra = async (id_compra) => {
        const response = await api.get(`/compraproducto/id_compra/${id_compra}`);
        return response.data;
    };

    /** Crea un nuevo producto de compra */
    const createCompraProducto = async (newCompraProducto) => {
        const response = await api.post('/compraproducto', newCompraProducto);
        return response.data;
    };

    /** Actualiza un producto de compra por su ID */
    const updateCompraProducto = async (id, updatedCompraProducto) => {
        const response = await api.put(`/compraproducto/${id}`, updatedCompraProducto);
        return response.data;
    };

    /** Elimina un producto de compra por su ID */
    const deleteCompraProducto = async (id) => {
        const response = await api.delete(`/compraproducto/${id}`);
        return response.data;
    };


    return {
        getAllCompraProductos,
        getCompraProductoById,
        getCompraProductoByIdCompra,
        createCompraProducto,
        updateCompraProducto,
        deleteCompraProducto,
    };
}

export default useCompraProducto;