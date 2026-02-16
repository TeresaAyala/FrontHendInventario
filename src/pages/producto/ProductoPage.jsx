import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Typography, TextField, Button, Table, TableBody, 
    TableCell, TableContainer, TableRow, Paper, 
    IconButton, Grid, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Snackbar, Alert, Stack, Chip, Box, Avatar
} from '@mui/material';

import { 
    Delete as DeleteIcon, 
    Edit as EditIcon, 
    Add as AddIcon, 
    Search as SearchIcon,
    Inventory2 as InventoryIcon,
    ArrowBackIosNew as BackIcon
} from '@mui/icons-material';

import { getProducto, deleteProducto } from '../../services/productoServices';
import { getAuthUsuario } from '../../utils/auth';

const ProductoPage = () => {
    const usuario = getAuthUsuario();
    const navigate = useNavigate();

    const [producto, setProducto] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ sku: '', nombre: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProductoId, setSelectedProductoId] = useState(null);

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const hasPermission = usuario?.roles === 'ADMIN' || usuario?.roles === 'INVENTORY';

    const fetchProducto = async () => {
        try {
            setLoading(true);
            const response = await getProducto(formData);
            setProducto(response.data);
        } catch (error) {
            showNotification('Error al cargar productos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => setNotification({ ...notification, open: false });

    const handleOpenDeleteDialog = (id) => {
        setSelectedProductoId(id);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteProducto(selectedProductoId);
            showNotification('Producto eliminado correctamente');
            fetchProducto();
        } catch {
            showNotification('No se pudo eliminar el producto', 'error');
        } finally {
            setOpenDialog(false);
            setSelectedProductoId(null);
        }
    };

    useEffect(() => {
        fetchProducto();
    }, []);

    const actionButtonStyle = {
        height: '56px',
        borderRadius: '16px',
        textTransform: 'none',
        fontWeight: '800',
        boxShadow: 'none'
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
                <IconButton onClick={() => navigate('/')} sx={{ color: '#1976d2' }}>
                    <BackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: '900', mr: 5 }}>
                    Inventario de Productos
                </Typography>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
                

                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Buscar por SKU"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Nombre del producto"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', gap: 1.5 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<SearchIcon />}
                                onClick={fetchProducto}
                                sx={{ ...actionButtonStyle, bgcolor: '#1e40af' }}
                            >
                                Buscar
                            </Button>

                            {hasPermission && (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate('/producto/create')}
                                    sx={{ ...actionButtonStyle, bgcolor: '#10b981' }}
                                >
                                    Nuevo
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Box>

                <TableContainer 
                    component={Paper} 
                    sx={{ 
                        boxShadow: 'none', 
                        border: '1px solid #F1F5F9', 
                        borderRadius: '20px',
                        overflow: 'hidden'
                    }}
                >
                    <Table>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                        <CircularProgress size={30} />
                                    </TableCell>
                                </TableRow>
                            ) : producto.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                        <Typography color="text.secondary">No se encontraron productos</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                producto.map((p) => (
                                    <TableRow key={p._id} sx={{ '&:last-child td': { border: 0 } }}>
                                        <TableCell sx={{ width: 60 }}>
                                            <Avatar sx={{ bgcolor: '#F1F5F9', color: '#1e40af', borderRadius: '12px' }}>
                                                <InventoryIcon fontSize="small" />
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#1E293B' }}>
                                                {p.nombre}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                                                SKU: {p.sku} • {p.categoria}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="subtitle2" fontWeight="800">
                                                ${p.precio}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: p.cantidad < 5 ? '#ef4444' : '#64748B' }}>
                                                Stock: {p.cantidad}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                label={p.estadoStock}
                                                size="small"
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    fontSize: '10px',
                                                    bgcolor: p.estadoStock === 'DISPONIBLE' ? '#F0FDF4' : '#FEF2F2',
                                                    color: p.estadoStock === 'DISPONIBLE' ? '#16A34A' : '#DC2626',
                                                    border: `1px solid ${p.estadoStock === 'DISPONIBLE' ? '#DCFCE7' : '#FEE2E2'}`
                                                }}
                                            />
                                        </TableCell>
                                        {hasPermission && (
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => navigate(`/producto/edit/${p._id}`)}
                                                        sx={{ color: '#3b82f6', bgcolor: '#eff6ff' }}
                                                    >
                                                        <EditIcon fontSize="inherit" />
                                                    </IconButton>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleOpenDeleteDialog(p._id)}
                                                        sx={{ color: '#ef4444', bgcolor: '#fef2f2' }}
                                                    >
                                                        <DeleteIcon fontSize="inherit" />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog 
                    open={openDialog} 
                    onClose={() => setOpenDialog(false)}
                    PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
                >
                    <DialogTitle sx={{ fontWeight: '800' }}>¿Eliminar producto?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Esta acción es permanente y el producto desaparecerá del inventario.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, gap: 1 }}>
                        <Button 
                            onClick={() => setOpenDialog(false)} 
                            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleConfirmDelete} 
                            color="error" 
                            variant="contained" 
                            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 'bold', boxShadow: 'none' }}
                        >
                            Sí, eliminar
                        </Button>
                    </DialogActions>
                </Dialog>

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
            </Container>
        </Box>
    );
};

export default ProductoPage;