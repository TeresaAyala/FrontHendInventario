import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, IconButton,
  CircularProgress, Stack, Button, Dialog,
  DialogTitle, DialogContent, DialogContentText,
  DialogActions, Snackbar, Alert
} from '@mui/material';

import { Delete, Edit, Add } from '@mui/icons-material';

import { getProveedores, deleteProveedor } from '../../services/proveedoresServices';

const ProveedoresPage = () => {

  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [notification, setNotification] = useState({ open:false, message:'', severity:'success' });

  const fetchProveedores = async () => {
    try {
      const res = await getProveedores();
      setProveedores(res.data);
    } catch {
      showNotification('Error al cargar proveedores','error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProveedores(); }, []);

  const showNotification = (message, severity='success') =>
    setNotification({ open:true, message, severity });

  const confirmDelete = async () => {
    try {
      await deleteProveedor(selectedId);
      showNotification('Proveedor eliminado');
      fetchProveedores();
    } catch {
      showNotification('No se pudo eliminar','error');
    }
    setOpenDialog(false);
  };

  return (
    <Container sx={{ mt:4 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h4" fontWeight="bold">
          Proveedores
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/proveedores/create')}
        >
          Nuevo
        </Button>
      </Stack>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Contacto</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              proveedores.map(p => (
                <TableRow key={p._id}>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.contacto || '-'}</TableCell>
                  <TableCell>{p.telefono || '-'}</TableCell>
                  <TableCell>{p.email || '-'}</TableCell>
                  <TableCell>{p.categoria?.nombre || '-'}</TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/proveedores/edit/${p._id}`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => { setSelectedId(p._id); setOpenDialog(true); }}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDialog} onClose={()=>setOpenDialog(false)}>
        <DialogTitle>¿Eliminar proveedor?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenDialog(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={()=>setNotification({...notification, open:false})}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ProveedoresPage;

