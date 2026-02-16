import { getUsuario } from '../../services/usuarioServices';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    IconButton,
    InputBase,
    Avatar,
    CircularProgress,
    Button,
    Paper
} from '@mui/material';

import {
    Search as SearchIcon,
    AddCircle as AddIcon,
    ChevronRight as ChevronRightIcon,
    PersonSearch as PersonSearchIcon
} from '@mui/icons-material';

const UsuarioPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ nombre: '', apellido: '' });
    const navigate = useNavigate();

    const adaptableButtonStyle = {
        width: '100%',
        height: '56px',
        borderRadius: '16px',
        textTransform: 'none',
        fontWeight: '800',
        fontSize: '1rem',
        boxShadow: 'none',
        display: 'flex',
        gap: 1,
        bgcolor: '#1976d2',
        '&:hover': { bgcolor: '#1565c0' }
    };

    const fetchUsuario = async () => {
        try {
            setLoading(true);
            const response = await getUsuario(formData);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error fetching Users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuario();
    }, []);

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'white', display: 'flex', flexDirection: 'column' }}>
            
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                px: 2, 
                py: 2, 
                borderBottom: '1px solid #f0f0f0',
                position: 'sticky',
                top: 0,
                bgcolor: 'white',
                zIndex: 10
            }}>
                <Typography variant="h5" sx={{ fontWeight: '900', color: '#1a1a1a' }}>Usuarios</Typography>
                <IconButton color="primary" onClick={() => navigate('/usuario/create')}>
                    <AddIcon sx={{ fontSize: 35 }} />
                </IconButton>
            </Box>

            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Box sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        bgcolor: '#f2f2f7', 
                        borderRadius: '14px', 
                        px: 2, 
                        height: '50px' 
                    }}>
                        <SearchIcon sx={{ color: '#8e8e93', mr: 1, fontSize: 20 }} />
                        <InputBase
                            placeholder="Nombre..."
                            fullWidth
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            sx={{ fontSize: '0.95rem' }}
                        />
                    </Box>
                    <Box sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        bgcolor: '#f2f2f7', 
                        borderRadius: '14px', 
                        px: 2, 
                        height: '50px' 
                    }}>
                        <InputBase
                            placeholder="Apellido..."
                            fullWidth
                            value={formData.apellido}
                            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                            sx={{ fontSize: '0.95rem' }}
                        />
                    </Box>
                </Box>

                <Button 
                    variant="contained" 
                    onClick={fetchUsuario}
                    startIcon={<PersonSearchIcon />}
                    sx={adaptableButtonStyle}
                >
                    Buscar Usuario
                </Button>
            </Box>

            <Box sx={{ flex: 1, px: 2, pb: 4 }}>
                <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#8e8e93', ml: 1 }}>
                    Resultados ({usuarios.length})
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
                ) : (
                    usuarios.map((u) => (
                        <Paper
                            key={u._id}
                            elevation={0}
                            onClick={() => navigate(`/usuario/edit/${u._id}`)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                py: 2,
                                px: 1,
                                borderBottom: '1px solid #f5f5f5',
                                cursor: 'pointer',
                                '&:active': { bgcolor: '#f9fafb', borderRadius: '12px' }
                            }}
                        >
                            <Avatar
                                sx={{ 
                                    width: 54, height: 54, borderRadius: '16px', 
                                    mr: 2, bgcolor: '#e3f2fd', color: '#1976d2',
                                    fontWeight: 'bold', fontSize: '18px',
                                    border: '1px solid #d1e9ff'
                                }}
                            >
                                {u.nombre.charAt(0)}{u.apellido.charAt(0)}
                            </Avatar>
                            
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: '800', color: '#1a1a1a', lineHeight: 1.2 }}>
                                    {u.nombre} {u.apellido}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                                    {u.email}
                                </Typography>
                                <Box sx={{ 
                                    display: 'inline-block', px: 1.2, py: 0.3, 
                                    bgcolor: '#f0f4f8', borderRadius: '8px' 
                                }}>
                                    <Typography sx={{ fontSize: '11px', fontWeight: '900', color: '#475569', textTransform: 'uppercase' }}>
                                        {u.roles}
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <ChevronRightIcon sx={{ color: '#c7c7cc' }} />
                        </Paper>
                    ))
                )}

                {!loading && usuarios.length === 0 && (
                    <Box sx={{ textAlign: 'center', mt: 8 }}>
                        <Typography color="text.secondary">No se encontraron usuarios</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default UsuarioPage;