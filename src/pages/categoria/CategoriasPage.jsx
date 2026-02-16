import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
  CircularProgress, Grid, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
  Snackbar, Alert, Stack
} from '@mui/material';
import { Delete, Edit, Add, Search } from '@mui/icons-material';

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
    await deleteCategoria(selectedId);
    showNotification('Categoría eliminada');
    setOpenDialog(false);
    fetchCategorias();
  };

  useEffect(() => { fetchCategorias(); }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Categorías
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre"
              size="small"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} display="flex" gap={1}>
            <Button variant="contained" startIcon={<Search />} onClick={fetchCategorias}>
              Buscar
            </Button>

            {canEdit && (
              <Button
                variant="contained"
                color="success"
                startIcon={<Add />}
                onClick={() => navigate('/categoria/create')}
              >
                Nueva
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Descripción</strong></TableCell>
              {canEdit && <TableCell align="center"><strong>Acciones</strong></TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              categorias.map(cat => (
                <TableRow key={cat._id}>
                  <TableCell>{cat.nombre}</TableCell>
                  <TableCell>{cat.descripcion || '-'}</TableCell>

                  {canEdit && (
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton color="primary" onClick={() => navigate(`/categoria/edit/${cat._id}`)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => {
                          setSelectedId(cat._id);
                          setOpenDialog(true);
                        }}>
                          <Delete />
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
        <DialogTitle>Eliminar categoría</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CategoriasPage;
