import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button,
  Box, Grid, Divider, Stack
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import { createCatalogo } from '../../services/catalogoServices';
import ErrorMessage from '../../components/ErrorMessage';

const CreateCatalogoPage = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      const data = new FormData();
      data.append('nombre', formData.nombre);
      data.append('descripcion', formData.descripcion);
      if (formData.imagen) data.append('imagen', formData.imagen);

      await createCatalogo(data);
      navigate('/catalogo');

    } catch (error) {
      setErrors([{ campo: 'SERVER', mensaje: 'Error al crear catálogo' }]);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Crear Catálogo
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                fullWidth
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                Subir Imagen
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    console.log(file); 
                    setFormData({ ...formData, imagen: file });
                  }}
                />
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/catalogo')}
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

        <Box sx={{ mt: 2 }}>
          <ErrorMessage errors={errors} />
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateCatalogoPage;
