import api from '../api/axiosInstance';

export const createDetalleResibo = (data) =>api.post('/detalleRecibo', data);
export const getListaDetallesRecibo = (reciboId) =>api.get(`/detalleRecibo/recibo/${reciboId}`);
export const inactivarDetalle = (id) =>api.put(`/detalleRecibo/inactivar/${id}`);
