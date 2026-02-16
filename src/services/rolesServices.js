import api from '../api/axiosInstance';

export const getRoles = () => api.get('/roles');
export const getRolesById = (id) => api.get(`/roles/${id}`);
export const createRoles = (rolesData) => api.post('/roles', rolesData);
export const updateRoles = (id, rolesData) => api.put(`/roles/${id}`, rolesData);
export const deleteRoles = (id) => api.delete(`/roles/${id}`);