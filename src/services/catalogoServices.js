import api from '../api/axiosInstance';

export const getCatalogos = () => api.get('/catalogo');
export const createCatalogo = (data) => api.post('/catalogo', data, {headers: {'Content-Type': 'multipart/form-data', },});
export const inactivarCatalogo = (id) =>api.put(`/catalogo/inactivar/${id}`);
