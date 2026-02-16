import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField,
  Button, Grid, Stack, Divider
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';

import { salidaStock } from '../../services/movimientosInventarioServices';
import ErrorMessage from '../../components/ErrorMessage';

const SalidaStockPage = () => {

  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    producto: '',
    cantidad: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      await salidaStock(formData);
      navigate('/movimientosInventario');
    } catch {
      setErrors([{ campo: 'SERVER', mensaje: 'Error al registrar salida' }]);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" fontWeight="bold">
          Salida de Stock
        </Typography>

        <Divider sx={{ my: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              <TextField
                label="ID Producto"
                fullWidth
                required
                value={formData.producto}
                onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Cantidad"
                type="number"
                fullWidth
                required
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button fullWidth variant="outlined" startIcon={<ArrowBack />}
                  onClick={() => navigate('/movimientosInventario')}>
                  Cancelar
                </Button>

                <Button type="submit" fullWidth variant="contained" startIcon={<Save />}>
                  Guardar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>

        <ErrorMessage errors={errors} />
      </Paper>
    </Container>
  );
};

export default SalidaStockPage;
