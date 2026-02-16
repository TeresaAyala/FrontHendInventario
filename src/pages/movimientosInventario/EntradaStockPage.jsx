import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, TextField,
    Button, Grid, Box, IconButton, Avatar, InputAdornment
} from '@mui/material';
import { 
    Save as SaveIcon, 
    ArrowBackIosNew as BackIcon,
    AddCircleOutline as EntradaIcon,
    Numbers as QtyIcon,
    Key as IdIcon
} from '@mui/icons-material';

import { entradaStock } from '../../services/movimientosInventarioServices';
import ErrorMessage from '../../components/ErrorMessage';

const EntradaStockPage = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        producto: '',
        cantidad: ''
    });

    const actionButtonStyle = {
        height: '56px',
        borderRadius: '16px',
        textTransform: 'none',
        fontWeight: '800',
        fontSize: '1rem',
        boxShadow: 'none',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        try {
            await entradaStock(formData);
            navigate('/movimientos');
        } catch (error) {
            setErrors([{ campo: 'SERVER', mensaje: 'Error al registrar entrada en el servidor' }]);
        }
    };

    return (
        <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh' }}>
            
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                px: 2, 
                py: 2, 
                borderBottom: '1px solid #F1F5F9' 
            }}>
                <IconButton onClick={() => navigate('/movimientos')} sx={{ color: '#1976d2' }}>
                    <BackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: '900', mr: 5 }}>
                    Registrar Entrada
                </Typography>
            </Box>

            <Container maxWidth="sm" sx={{ mt: 6, pb: 4 }}>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
                    <Avatar sx={{ bgcolor: '#DCFCE7', color: '#16A34A', width: 80, height: 80, mb: 2 }}>
                        <EntradaIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: '900', color: '#1E293B' }}>
                        Entrada de Mercancía
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', mt: 1 }}>
                        Aumenta el stock disponible de un producto
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>

                        <Grid item xs={12}>
                            <TextField
                                label="ID del Producto"
                                fullWidth
                                required
                                value={formData.producto}
                                onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
                                placeholder="Pega el ID o escanea el código"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IdIcon sx={{ color: '#94A3B8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Cantidad a Ingresar"
                                type="number"
                                fullWidth
                                required
                                value={formData.cantidad}
                                onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                                placeholder="0"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <QtyIcon sx={{ color: '#94A3B8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button 
                                    type="submit" 
                                    fullWidth 
                                    variant="contained" 
                                    startIcon={<SaveIcon />}
                                    sx={{ 
                                        ...actionButtonStyle, 
                                        bgcolor: '#16A34A',
                                        '&:hover': { bgcolor: '#15803D' }
                                    }}
                                >
                                    Confirmar Entrada
                                </Button>

                                <Button 
                                    fullWidth 
                                    variant="outlined" 
                                    onClick={() => navigate('/movimientos')}
                                    sx={{ 
                                        ...actionButtonStyle, 
                                        color: '#64748B', 
                                        borderColor: '#E2E8F0',
                                        borderWidth: '2px',
                                        '&:hover': { borderColor: '#CBD5E1', borderWidth: '2px' }
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>

                <Box sx={{ mt: 3 }}>
                    <ErrorMessage errors={errors} />
                </Box>
            </Container>
        </Box>
    );
};

export default EntradaStockPage;