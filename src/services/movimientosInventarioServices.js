import api from '../api/axiosInstance';

export const getMovimientosInventario = () =>api.get('/movimientosInventario');
export const entradaStock = (data) =>api.post('/movimientosInventario/entrada', data);
export const salidaStock = (data) =>api.post('/movimientosInventario/salida', data);

