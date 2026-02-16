import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioZodSchema } from '../../schemas/usuario';
import ErrorMessage from '../../components/ErrorMessage';
import { createUsuario } from '../../services/usuarioServices';

import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    MenuItem, 
    IconButton,
    Avatar
} from '@mui/material';
import { 
    ArrowBackIosNew as BackIcon, 
    PersonAdd as PersonAddIcon,
    Save as SaveIcon
} from '@mui/icons-material';

const CreateUsuarioPage = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        password: '',
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
                await createUsuario(formData);
                navigate('/usuario');
            }
        } catch (error) {
            let serverMessage = error.response?.data.error || 'Error en el servidor';
            setErrors([{ campo: 'SERVER', mensaje: serverMessage }]);
        }
    }

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
                    Nuevo Usuario
                </Typography>
            </Box>

            <Box sx={{ p: 2, width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, mt: 2 }}>
                    <Avatar sx={{ bgcolor: '#eff6ff', color: '#1e40af', width: 80, height: 80, mb: 2 }}>
                        <PersonAddIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                        Completa la información del nuevo empleado
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
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                        />

                        <TextField
                            fullWidth
                            label="Teléfono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                        />

                        <TextField
                            fullWidth
                            label="Contraseña Temporal"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                select
                                fullWidth
                                label="Rol de Acceso"
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

                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                sx={{ 
                                    ...adaptableButtonStyle,
                                    bgcolor: '#1976d2',
                                    '&:hover': { bgcolor: '#1565c0' }
                                }}
                            >
                                Crear Cuenta de Usuario
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() => navigate('/usuario')}
                                sx={{ 
                                    ...adaptableButtonStyle,
                                    color: '#64748b',
                                    borderColor: '#e2e8f0',
                                    borderWidth: '2px',
                                    '&:hover': { borderColor: '#cbd5e1', borderWidth: '2px', bgcolor: '#f8fafc' }
                                }}
                            >
                                Cancelar y Volver
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}

export default CreateUsuarioPage;