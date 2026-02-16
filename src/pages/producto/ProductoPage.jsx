import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Typography, TextField, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, 
    IconButton, Grid, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Snackbar, Alert, Stack, Chip
} from '@mui/material';

import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';

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

    const hasPermission =
        usuario?.roles === 'ADMIN' || usuario?.roles === 'INVENTORY';

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

    const handleCloseSnackbar = () =>
        setNotification({ ...notification, open: false });

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

    return (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Gestión de Productos
            </Typography>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="SKU"
                            size="small"
                            value={formData.sku}
                            onChange={(e) =>
                                setFormData({ ...formData, sku: e.target.value })
                            }
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            size="small"
                            value={formData.nombre}
                            onChange={(e) =>
                                setFormData({ ...formData, nombre: e.target.value })
                            }
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            startIcon={<SearchIcon />}
                            onClick={fetchProducto}
                            sx={{ flexGrow: 1 }}
                        >
                            Buscar
                        </Button>

                        {hasPermission && (
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/producto/create')}
                                sx={{ flexGrow: 1 }}
                            >
                                Nuevo
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 900 }}>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><strong>SKU</strong></TableCell>
                            <TableCell><strong>Nombre</strong></TableCell>
                            <TableCell><strong>Categoría</strong></TableCell>
                            <TableCell><strong>Precio</strong></TableCell>
                            <TableCell><strong>Cantidad</strong></TableCell>
                            <TableCell><strong>Estado</strong></TableCell>
                            {hasPermission && (
                                <TableCell align="center"><strong>Acciones</strong></TableCell>
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            producto.map((p) => (
                                <TableRow key={p._id} hover>
                                    <TableCell><strong>{p.sku}</strong></TableCell>
                                    <TableCell>{p.nombre}</TableCell>
                                    <TableCell>{p.categoria}</TableCell>
                                    <TableCell>${p.precio}</TableCell>
                                    <TableCell>{p.cantidad}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={p.estadoStock}
                                            color={p.estadoStock === 'DISPONIBLE' ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>

                                    {hasPermission && (
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={() =>
                                                        navigate(`/producto/edit/${p._id}`)
                                                    }
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>

                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() =>
                                                        handleOpenDeleteDialog(p._id)
                                                    }
                                                >
                                                    <DeleteIcon fontSize="small" />
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

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>¿Confirmar eliminación?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={notification.severity} onClose={handleCloseSnackbar}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProductoPage;
