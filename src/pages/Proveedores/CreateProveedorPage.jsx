import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, TextField, Button, Grid, 
    Stack, Box, IconButton, InputAdornment, MenuItem, 
    FormControl, InputLabel, Select, Paper
} from '@mui/material';
import { 
    Save as SaveIcon, 
    ArrowBackIosNew as BackIcon,
    Business as BusinessIcon,
    Person as ContactIcon,
    LocalPhone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as MapIcon,
    Category as CategoryIcon
} from '@mui/icons-material';

import { createProveedor } from '../../services/proveedoresServices';
import { getCategorias } from '../../services/categoriaServices';
import ErrorMessage from '../../components/ErrorMessage';

const CreateProveedorPage = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '', contacto: '', telefono: '',
        email: '', direccion: '', categoria: ''
    });

    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const res = await getCategorias();
                setCategorias(res.data);
            } catch {
                setErrors([{ campo: 'SERVER', mensaje: 'Error cargando categorías' }]);
            }
        };
        cargarCategorias();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createProveedor(formData);
            navigate('/proveedores');
        } catch {
            setErrors([{ campo: 'SERVER', mensaje: 'Error al crear el proveedor' }]);
        }
    };

    return (
        
        <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', pb: 10 }}>

            <Box sx={{ bgcolor: '#FFF', px: 2, py: 1.5, display: 'flex', alignItems: 'center', borderBottom: '1px solid #F1F5F9', mb: 4 }}>
                <IconButton onClick={() => navigate('/proveedores')} sx={{ color: '#1E40AF' }}>
                    <BackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 900, textAlign: 'center', mr: 5 }}>
                    Registro de Contacto
                </Typography>
            </Box>

            <Container maxWidth="md">

                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, bgcolor: 'transparent' }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth label="Nombre de la Empresa" name="nombre" required
                                    value={formData.nombre} onChange={handleChange}
                                    placeholder="Ej: Distribuidora Global"
                                    InputProps={{ startAdornment: <InputAdornment position="start"><BusinessIcon color="action" /></InputAdornment> }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth label="Persona de Contacto" name="contacto"
                                    value={formData.contacto} onChange={handleChange}
                                    placeholder="Nombre del representante"
                                    InputProps={{ startAdornment: <InputAdornment position="start"><ContactIcon color="action" /></InputAdornment> }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth label="Teléfono" name="telefono"
                                    value={formData.telefono} onChange={handleChange}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment> }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth label="Email" name="email" type="email"
                                    value={formData.email} onChange={handleChange}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                                />
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth label="Dirección" name="direccion" multiline rows={2}
                                    value={formData.direccion} onChange={handleChange}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><MapIcon color="action" sx={{ mt: -2 }} /></InputAdornment> }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}>
                                    <InputLabel>Categoría</InputLabel>
                                    <Select
                                        name="categoria" value={formData.categoria} label="Categoría" onChange={handleChange}
                                        startAdornment={<InputAdornment position="start"><CategoryIcon color="action" /></InputAdornment>}
                                    >
                                        {categorias.map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.nombre}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Button
                                        type="submit" variant="contained" fullWidth
                                        startIcon={<SaveIcon />}
                                        sx={{ 
                                            height: '56px', borderRadius: '16px', bgcolor: '#1E40AF', 
                                            fontWeight: 800, textTransform: 'none', fontSize: '1rem', 
                                            boxShadow: 'none', 
                                            '&:hover': { bgcolor: '#1e3a8a', boxShadow: 'none' } 
                                        }}
                                    >
                                        Guardar Proveedor
                                    </Button>
                                    <Button
                                        variant="outlined" fullWidth
                                        onClick={() => navigate('/proveedores')}
                                        sx={{ 
                                            height: '56px', borderRadius: '16px', color: '#64748B', 
                                            borderColor: '#E2E8F0', fontWeight: 800, textTransform: 'none', 
                                            fontSize: '1rem', '&:hover': { borderColor: '#CBD5E1', bgcolor: '#F8FAFC' } 
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                    <Box sx={{ mt: 2 }}><ErrorMessage errors={errors} /></Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default CreateProveedorPage;