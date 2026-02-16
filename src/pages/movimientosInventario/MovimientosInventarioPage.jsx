import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, CircularProgress
} from '@mui/material';

import { getMovimientosInventario } from '../../services/movimientosInventarioServices';

const MovimientosInventarioPage = () => {

  const [movimientosInventario, setMovimientosInventario] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovimientosInventario = async () => {
    try {
      const res = await getMovimientosInventario();
      setMovimientosInventario(res.data);
    } catch (error) {
      console.error('Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovimientosInventario();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Movimientos de Inventario
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Usuario</TableCell>
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
              movimientosInventario.map(mov => (
                <TableRow key={mov._id}>
                  <TableCell>{mov.producto?.nombre}</TableCell>
                  <TableCell>{mov.tipo}</TableCell>
                  <TableCell>{mov.cantidad}</TableCell>
                  <TableCell>
                    {new Date(mov.fecha).toLocaleString()}
                  </TableCell>
                  <TableCell>{mov.usuario?.nombre}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default MovimientosInventarioPage;
