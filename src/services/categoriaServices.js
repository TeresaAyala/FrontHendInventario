import axios from '../api/axiosInstance';

export const getCategorias = (params) => axios.get('/categoria', { params });
export const getCategoriaById = (id) => axios.get(`/categoria/${id}`);
export const createCategoria = (data) => axios.post('/categoria', data);
export const updateCategoria = (id, data) => axios.put(`/categoria/${id}`, data);
export const deleteCategoria = (id) => axios.delete(`/categoria/${id}`);
