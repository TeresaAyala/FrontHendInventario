import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, IconButton,
  CircularProgress, Snackbar, Alert
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

import {
  getDetallesByRecibo,
  inactivarDetalle
} from '../../services/detalleReciboServices';

const ListaDetallesReciboPage = () => {
  const { reciboId } = useParams();

  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchDetalles = async () => {
    try {
      const res = await getDetallesByRecibo(reciboId);
      setDetalles(res.data);
    } catch {
      showNotification('Error al cargar detalles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inactivar = async (id) => {
    try {
      await inactivarDetalle(id);
      showNotification('Detalle inactivado');
      fetchDetalles();
    } catch {
      showNotification('No se pudo inactivar', 'error');
    }
  };

  const showNotification = (message, severity='success') => {
    setNotification({ open: true, message, severity });
  };

  useEffect(() => {
    fetchDetalles();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Detalles del Recibo
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell align="center">Acción</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              detalles.map(det => (
                <TableRow key={det._id}>
                  <TableCell>{det.producto?.nombre}</TableCell>
                  <TableCell>{det.cantidad}</TableCell>
                  <TableCell>${det.precio}</TableCell>
                  <TableCell>${det.subtotal}</TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => inactivar(det._id)}>
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

export default ListaDetallesReciboPage;
