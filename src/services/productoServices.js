import api from '../api/axiosInstance';

export const getProducto = (filtros) => {
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, value]) =>
            value !== '' && value !== null && value !== undefined
        )
    );

    return api.get('/producto', {   
        params: filtrosLimpios
    });
};

export const getProductoById = (id) => api.get(`/producto/${id}`);
export const createProducto = (productoData) =>api.post('/producto', productoData);
export const updateProducto = (id, productoData) =>api.put(`/producto/${id}`, productoData);
export const deleteProducto = (id) =>api.delete(`/producto/${id}`);
