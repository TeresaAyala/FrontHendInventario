import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField,
  Button, Box, Grid, Divider, Stack
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import { createCategoria } from '../../services/categoriaServices';
import ErrorMessage from '../../components/ErrorMessage';

const CreateCategoriaPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      await createCategoria(formData);
      navigate('/categorias');
    } catch (error) {
      const message = error.response?.data?.error || 'Error del servidor';
      setErrors([{ campo: 'SERVER', mensaje: message }]);
    }
  };

  const hasError = (field) => errors.some(e => e.campo === field);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>

        <Typography variant="h4" align="center" fontWeight="bold">
          Nueva Categoría
        </Typography>

        <Divider sx={{ my: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                error={hasError('nombre')}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                error={hasError('descripcion')}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/categorias')}
                >
                  Cancelar
                </Button>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                >
                  Guardar
                </Button>
              </Stack>
            </Grid>

          </Grid>
        </form>

        <Box sx={{ mt: 3 }}>
          <ErrorMessage errors={errors} />
        </Box>

      </Paper>
    </Container>
  );
};

export default CreateCategoriaPage;
