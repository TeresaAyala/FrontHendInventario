import api from '../api/axiosInstance';

export const getRecibos = () => api.get('/recibo');
export const getReciboById = (id) => api.get(`/recibo/${id}`);
export const createRecibo = (data) => api.post('/recibo', data);
export const anularRecibo = (id) => api.put(`/recibo/anular/${id}`);
export const getHistorial = () => api.get('/recibo/historial');
