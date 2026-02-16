import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
  CircularProgress, Grid, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
  Snackbar, Alert, Stack, Box, InputAdornment
} from '@mui/material';
import { 
  DeleteOutline as Delete, 
  EditOutlined as Edit, 
  Add as AddIcon, 
  Search as SearchIcon,
  Category as CategoryIcon 
} from '@mui/icons-material';

import { getCategorias, deleteCategoria } from '../../services/categoriaServices';
import { getAuthUsuario } from '../../utils/auth';

const CategoriasPage = () => {
  const usuario = getAuthUsuario();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const canEdit = usuario?.roles === 'ADMIN';

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const res = await getCategorias({ nombre });
      setCategorias(res.data);
    } catch {
      showNotification('Error al cargar categorías', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'success') =>
    setNotification({ open: true, message, severity });

  const confirmDelete = async () => {
    try {
      await deleteCategoria(selectedId);
      showNotification('Categoría eliminada');
      setOpenDialog(false);
      fetchCategorias();
    } catch {
      showNotification('Error al eliminar', 'error');
    }
  };

  useEffect(() => { fetchCategorias(); }, []);

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', pb: 10 }}>
      
      {/* HEADER LIMPIO */}
      <Box sx={{ px: 3, py: 3, borderBottom: '1px solid #F1F5F9', mb: 4 }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <CategoryIcon sx={{ color: '#1E40AF', fontSize: 32 }} />
              <Typography variant="h5" fontWeight="900" color="#1E293B">
                Categorías
              </Typography>
            </Stack>

            {canEdit && (
              <Button
                variant="contained"
                disableElevation
                startIcon={<AddIcon />}
                onClick={() => navigate('/categoria/create')}
                sx={{ 
                  borderRadius: '12px', bgcolor: '#1E40AF', textTransform: 'none',
                  fontWeight: 700, px: 3, '&:hover': { bgcolor: '#1e3a8a' }
                }}
              >
                Nueva Categoría
              </Button>
            )}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* FILTRO DE BÚSQUEDA PLANO */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre..."
                size="small"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchCategorias()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#94A3B8' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '12px', bgcolor: '#F8FAFC' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button 
                onClick={fetchCategorias}
                sx={{ fontWeight: 700, textTransform: 'none', color: '#1E40AF' }}
              >
                Refrescar lista
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* TABLA ESTILO FLAT */}
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #F1F5F9' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>Descripción</TableCell>
                {canEdit && <TableCell align="center" sx={{ fontWeight: 800, color: '#64748B' }}>Acciones</TableCell>}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={30} sx={{ color: '#1E40AF' }} />
                  </TableCell>
                </TableRow>
              ) : categorias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 8, color: '#94A3B8' }}>
                    No se encontraron categorías
                  </TableCell>
                </TableRow>
              ) : (
                categorias.map(cat => (
                  <TableRow key={cat._id} hover>
                    <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>{cat.nombre}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{cat.descripcion || '-'}</TableCell>

                    {canEdit && (
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton 
                            sx={{ color: '#64748B', '&:hover': { bgcolor: '#F1F5F9', color: '#1E40AF' } }}
                            onClick={() => navigate(`/categoria/edit/${cat._id}`)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton 
                            sx={{ color: '#64748B', '&:hover': { bgcolor: '#FEF2F2', color: '#EF4444' } }}
                            onClick={() => {
                              setSelectedId(cat._id);
                              setOpenDialog(true);
                            }}
                          >
                            <Delete fontSize="small" />
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
      </Container>

      {/* DIALOGO DE ELIMINACIÓN */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>¿Eliminar categoría?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción no se puede deshacer y podría afectar a los proveedores asociados.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#64748B', fontWeight: 700 }}>Cancelar</Button>
          <Button 
            color="error" 
            variant="contained" 
            disableElevation
            onClick={confirmDelete}
            sx={{ borderRadius: '10px', fontWeight: 700, textTransform: 'none' }}
          >
            Confirmar Eliminación
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} variant="filled" sx={{ borderRadius: '12px', fontWeight: 600 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoriasPage;