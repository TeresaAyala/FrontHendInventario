import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, IconButton,
  CircularProgress, Stack, Button, Dialog,
  DialogTitle, DialogContent, DialogContentText,
  DialogActions, Snackbar, Alert, Box, Chip
} from '@mui/material';

import { 
  DeleteOutline as Delete, 
  EditOutlined as Edit, 
  Add as AddIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

import { getProveedores, deleteProveedor } from '../../services/proveedoresServices';

const ProveedoresPage = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchProveedores = async () => {
    try {
      const res = await getProveedores();
      setProveedores(res.data);
    } catch {
      showNotification('Error al cargar proveedores', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProveedores(); }, []);

  const showNotification = (message, severity = 'success') =>
    setNotification({ open: true, message, severity });

  const confirmDelete = async () => {
    try {
      await deleteProveedor(selectedId);
      showNotification('Proveedor eliminado correctamente');
      fetchProveedores();
    } catch {
      showNotification('No se pudo eliminar el proveedor', 'error');
    }
    setOpenDialog(false);
  };

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', pb: 10 }}>
      
      <Box sx={{ px: 3, py: 3, borderBottom: '1px solid #F1F5F9', mb: 4 }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <BusinessIcon sx={{ color: '#1E40AF', fontSize: 32 }} />
              <Typography variant="h5" fontWeight="900" color="#1E293B">
                Proveedores
              </Typography>
            </Stack>

            <Button
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
              onClick={() => navigate('/proveedores/create')}
              sx={{ 
                borderRadius: '12px', 
                bgcolor: '#1E40AF', 
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                '&:hover': { bgcolor: '#1e3a8a' }
              }}
            >
              Nuevo Proveedor
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* TABLA ESTILO FLAT */}
        <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>Contacto</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>Teléfono / Email</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>Categoría</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: '#64748B' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <CircularProgress size={30} sx={{ color: '#1E40AF' }} />
                  </TableCell>
                </TableRow>
              ) : proveedores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10, color: '#94A3B8' }}>
                    No hay proveedores registrados
                  </TableCell>
                </TableRow>
              ) : (
                proveedores.map(p => (
                  <TableRow key={p._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>{p.nombre}</TableCell>
                    <TableCell color="#475569">{p.contacto || '-'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#475569' }}>{p.telefono || '-'}</Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>{p.email || ''}</Typography>
                    </TableCell>
                    <TableCell>
                      {p.categoria ? (
                        <Chip 
                          label={p.categoria.nombre} 
                          size="small" 
                          sx={{ bgcolor: '#EFF6FF', color: '#1E40AF', fontWeight: 600, borderRadius: '8px' }} 
                        />
                      ) : '-'}
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          sx={{ color: '#64748B', '&:hover': { bgcolor: '#F1F5F9', color: '#1E40AF' } }}
                          onClick={() => navigate(`/proveedores/edit/${p._id}`)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          sx={{ color: '#64748B', '&:hover': { bgcolor: '#FEF2F2', color: '#EF4444' } }}
                          onClick={() => { setSelectedId(p._id); setOpenDialog(true); }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Container>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>¿Eliminar proveedor?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción eliminará permanentemente a <strong>{proveedores.find(p => p._id === selectedId)?.nombre}</strong>.
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
            Eliminar ahora
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          severity={notification.severity} 
          variant="filled" 
          sx={{ borderRadius: '12px', fontWeight: 600 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProveedoresPage;