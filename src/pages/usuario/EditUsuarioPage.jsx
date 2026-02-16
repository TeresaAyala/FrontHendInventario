import { getUsuarioById, updateUsuario } from '../../services/usuarioServices';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usuarioZodSchema } from '../../schemas/usuario';
import ErrorMessage from '../../components/ErrorMessage';

import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    MenuItem, 
    IconButton,
    Avatar,
    Paper
} from '@mui/material';
import { 
    ArrowBackIosNew as BackIcon, 
    EditNote as EditIcon,
    Update as UpdateIcon
} from '@mui/icons-material';

const EditUsuarioPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        roles: 'SALES',
        status: 'active'
    });

    const adaptableButtonStyle = {
        width: '100%',
        height: '56px',
        borderRadius: '16px',
        textTransform: 'none',
        fontWeight: '800',
        fontSize: '1rem',
        boxShadow: 'none',
    };

    const fetchUsuario = async () => {
        try {
            const response = await getUsuarioById(id);
            const { nombre, apellido, email, telefono, roles, status } = response.data;
            setFormData({ nombre, apellido, email, telefono, roles, status });
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        fetchUsuario();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resultado = usuarioZodSchema.safeParse(formData);
            if (!resultado.success) {
                setErrors(resultado.error.issues.map(issue => ({
                    campo: issue.path[0],
                    mensaje: issue.message
                })));
            } else {
                await updateUsuario(id, formData);
                navigate('/usuario');
            }
        } catch (error) {
            let serverMessage = error.response?.data.error || 'Error al actualizar';
            setErrors([{ campo: 'SERVER', mensaje: serverMessage }]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'white' }}>
            
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                px: 2, 
                py: 2, 
                borderBottom: '1px solid #f0f0f0' 
            }}>
                <IconButton onClick={() => navigate('/usuario')} sx={{ color: '#1976d2' }}>
                    <BackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: '900', mr: 5 }}>
                    Editar Perfil
                </Typography>
            </Box>

            <Box sx={{ p: 2, width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, mt: 2 }}>
                    <Avatar sx={{ bgcolor: '#fff4e5', color: '#b45309', width: 70, height: 70, mb: 1.5 }}>
                        <EditIcon sx={{ fontSize: 35 }} />
                    </Avatar>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 'bold' }}>
                        ID: {id.substring(0, 12).toUpperCase()}
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                        </Box>

                        <TextField
                            fullWidth
                            label="Correo Electrónico"
                            name="email"
                            value={formData.email}
                            disabled
                            sx={{ 
                                '& .MuiOutlinedInput-root': { 
                                    borderRadius: '14px',
                                    bgcolor: '#f8fafc'
                                } 
                            }}
                            helperText="El correo no se puede modificar"
                        />

                        <TextField
                            fullWidth
                            label="Teléfono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                select
                                fullWidth
                                label="Rol"
                                name="roles"
                                value={formData.roles}
                                onChange={handleChange}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            >
                                <MenuItem value="SALES">Ventas</MenuItem>
                                <MenuItem value="INVENTORY">Inventario</MenuItem>
                                <MenuItem value="ADMIN">Administrador</MenuItem>
                            </TextField>

                            <TextField
                                select
                                fullWidth
                                label="Estado"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            >
                                <MenuItem value="active">Activo</MenuItem>
                                <MenuItem value="inactive">Inactivo</MenuItem>
                            </TextField>
                        </Box>

                        <Box sx={{ mt: 1 }}>
                            <ErrorMessage errors={errors} />
                        </Box>

                        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<UpdateIcon />}
                                sx={{ 
                                    ...adaptableButtonStyle,
                                    bgcolor: '#1976d2',
                                    '&:hover': { bgcolor: '#1565c0' }
                                }}
                            >
                                Guardar Cambios
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() => navigate('/usuario')}
                                sx={{ 
                                    ...adaptableButtonStyle,
                                    color: '#ef4444',
                                    borderColor: '#fee2e2',
                                    borderWidth: '2px',
                                    '&:hover': { 
                                        borderColor: '#fca5a5', 
                                        borderWidth: '2px', 
                                        bgcolor: '#fef2f2' 
                                    }
                                }}
                            >
                                Descartar Cambios
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default EditUsuarioPage;