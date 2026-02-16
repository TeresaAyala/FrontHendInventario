import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Container, Typography, TextField, Button, Grid,
    CircularProgress, Snackbar, Alert, MenuItem,
    Box, IconButton, Avatar, InputAdornment
} from "@mui/material";

import { 
    ArrowBackIosNew as BackIcon, 
    Edit as EditIcon, 
    Save as SaveIcon
} from "@mui/icons-material";

import { productoZodSchema } from '../../schemas/producto';
import { getProductoById, updateProducto } from "../../services/productoServices";
import { getCategorias } from "../../services/categoriaServices"; 

const EditProductoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [formData, setFormData] = useState({
        nombre: "",
        categoria: "",
        sku: "",
        precio: "",
        cantidad: "",
        imagen: "",
        estadoStock: "DISPONIBLE"
    });

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const actionButtonStyle = {
        width: '100%',
        height: '56px',
        borderRadius: '16px',
        textTransform: 'none',
        fontWeight: '800',
        boxShadow: 'none',
    };

    const showNotification = (message, severity = "success") => {
        setNotification({ open: true, message, severity });
    };

    const handleCloseSnackbar = () =>
        setNotification({ ...notification, open: false });

    const fetchData = async () => {
        try {
           
            const [resProducto] = await Promise.all([
                getProductoById(id),
             
            ]);
            
            setFormData(resProducto.data);
           
            setCategorias(['Tecnologia', 'Hogar', 'Oficina']); 
        } catch (error) {
            showNotification("Error al cargar los datos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

      
        const datosParaEnviar = {
            ...formData,
            precio: Number(formData.precio),
            cantidad: Number(formData.cantidad),
        
            imagen: formData.imagen || "https://via.placeholder.com/150"
        };

        const validacion = productoZodSchema.safeParse(datosParaEnviar);
        if (!validacion.success) {
            const errorMsg = validacion.error.issues[0].message;
            showNotification(`${validacion.error.issues[0].path[0]}: ${errorMsg}`, "error");
            return;
        }

        try {
            await updateProducto(id, datosParaEnviar);
            showNotification("Producto actualizado correctamente");
            setTimeout(() => navigate("/producto"), 1200);
        } catch (error) {
            const mensaje = error.response?.data?.error || "No se pudo actualizar";
            showNotification(mensaje, "error");
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#fff' }}>
                <CircularProgress size={40} thickness={5} sx={{ color: '#1e40af' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh' }}>
            
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2, borderBottom: '1px solid #F1F5F9' }}>
                <IconButton onClick={() => navigate('/producto')} sx={{ color: '#1976d2' }}>
                    <BackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: '900', mr: 5 }}>
                    Editar Producto
                </Typography>
            </Box>

            <Container maxWidth="sm" sx={{ mt: 4, pb: 4 }}>
               
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <Avatar sx={{ bgcolor: '#fef3c7', color: '#d97706', width: 70, height: 70, mb: 1.5 }}>
                        <EditIcon sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="900" sx={{ color: '#1E293B' }}>
                        {formData.nombre}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: '700' }}>
                        SKU: {formData.sku} (No editable)
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nombre del Producto"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            
                            <TextField
                                select
                                fullWidth
                                label="Categoría"
                                value={formData.categoria}
                                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            >
                                {categorias.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Estado"
                                select
                                value={formData.estadoStock}
                                onChange={(e) => setFormData({ ...formData, estadoStock: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            >
                                <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
                                <MenuItem value="AGOTADO">AGOTADO</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Precio"
                                value={formData.precio}
                                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Cantidad"
                                value={formData.cantidad}
                                onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                        </Grid>

                        

                        <Grid item xs={12} sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                sx={{ 
                                    ...actionButtonStyle,
                                    bgcolor: '#1e40af',
                                    '&:hover': { bgcolor: '#1e3a8a' }
                                }}
                            >
                                Guardar Cambios
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() => navigate("/producto")}
                                sx={{ 
                                    ...actionButtonStyle,
                                    color: '#64748b',
                                    borderColor: '#e2e8f0',
                                    borderWidth: '2px',
                                    '&:hover': { borderColor: '#cbd5e1', borderWidth: '2px', bgcolor: '#f8fafc' }
                                }}
                            >
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    severity={notification.severity} 
                    onClose={handleCloseSnackbar}
                    variant="filled"
                    sx={{ borderRadius: '12px', fontWeight: 'bold' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EditProductoPage;