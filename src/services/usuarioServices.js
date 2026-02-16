import api from '../api/axiosInstance';

export const getUsuario = (filtros) => {
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    return api.get('/usuario', {
        params: filtrosLimpios 
    });
};
export const getUsuarioById = (id)=> api.get(`/usuario/${id}`);
export const createUsuario = (usuarioData)=> api.post('/usuario', usuarioData);
export const updateUsuario = (id, usuarioData)=> api.put(`/usuario/${id}`, usuarioData);
export const loginUsuario = (usuarioData)=> api.post('/usuario/login', usuarioData);
export const changePasswordUsuario = (id, userData)=> api.put(`/usuario/${id}/change-password`, usuarioData);