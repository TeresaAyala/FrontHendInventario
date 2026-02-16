import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button,
  Grid, Divider, Stack
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import { createDetalleRecibo } from '../../services/detalleReciboServices';
import ErrorMessage from '../../components/ErrorMessage';

const CreateDetalleReciboPage = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    recibo: '',
    producto: '',
    cantidad: '',
    precio: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      await createDetalleRecibo(formData);
      navigate('/recibos');

    } catch (error) {
      setErrors([{ campo: 'SERVER', mensaje: 'Error al crear detalle' }]);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Crear Detalle del Recibo
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              <TextField
                label="ID Recibo"
                fullWidth
                required
                value={formData.recibo}
                onChange={(e) => setFormData({ ...formData, recibo: e.target.value })}
              />
            </Grid>

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
              <TextField
                label="Precio"
                type="number"
                fullWidth
                required
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/recibos')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<SaveIcon />}
                >
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

export default CreateDetalleReciboPage;
