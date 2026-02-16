import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, IconButton,
  CircularProgress, Snackbar, Alert, Button
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { getCatalogos, inactivarCatalogo } from '../../services/catalogoServices';

const CatalogosPage = () => {
  const navigate = useNavigate();

  const [catalogos, setCatalogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchCatalogos = async () => {
    try {
      const res = await getCatalogos();
      setCatalogos(res.data);
    } catch {
      showNotification('Error al cargar catálogos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inactivar = async (id) => {
    try {
      await inactivarCatalogo(id);
      showNotification('Catálogo inactivado');
      fetchCatalogos();
    } catch {
      showNotification('No se pudo inactivar', 'error');
    }
  };

  const showNotification = (message, severity='success') => {
    setNotification({ open: true, message, severity });
  };

  useEffect(() => {
    fetchCatalogos();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Catálogos
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => navigate('/catalogo/create')}
      >
        Nuevo
      </Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Imagen</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              catalogos.map(cat => (
                <TableRow key={cat._id}>
                  <TableCell>
                    <img src={cat.imagenUrl} width="60" alt="" />
                  </TableCell>
                  <TableCell>{cat.nombre}</TableCell>
                  <TableCell>{cat.descripcion}</TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => inactivar(cat._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default CatalogosPage;
