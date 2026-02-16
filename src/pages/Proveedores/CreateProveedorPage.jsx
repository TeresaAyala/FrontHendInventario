import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField,
  Button, Grid, Stack, Divider, MenuItem, Select
} from '@mui/material';

import { createProveedor } from '../../services/proveedoresServices';
import { getCategorias } from '../../services/categoriaServices';
import ErrorMessage from '../../components/ErrorMessage';

const CreateProveedorPage = () => {

  const navigate = useNavigate();

  const [errors, setErrors] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    categoria: ''
  });

  // cargar categorías
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const res = await getCategorias();
        setCategorias(res.data);
      } catch {
        setErrors([{ campo: 'SERVER', mensaje: 'Error cargando categorías' }]);
      }
    };

    cargarCategorias();
  }, []);

  // manejar cambios
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoria) {
      setErrors([{ campo: 'categoria', mensaje: 'Seleccione una categoría' }]);
      return;
    }

    try {
      await createProveedor(formData);
      navigate('/proveedores');
    } catch {
      setErrors([{ campo: 'SERVER', mensaje: 'Error al crear proveedor' }]);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" fontWeight="bold">
          Nuevo Proveedor
        </Typography>

        <Divider sx={{ my: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              <TextField
                label="Nombre"
                name="nombre"
                fullWidth
                required
                value={formData.nombre}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Contacto"
                name="contacto"
                fullWidth
                value={formData.contacto}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Teléfono"
                name="telefono"
                fullWidth
                value={formData.telefono}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Dirección"
                name="direccion"
                fullWidth
                value={formData.direccion}
                onChange={handleChange}
              />
            </Grid>

            {/* SELECT CATEGORIA */}
            <Grid item xs={12}>
              <Select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                fullWidth
                displayEmpty
              >
                <MenuItem value="">
                  Seleccione categoría
                </MenuItem>

                {categorias.map(cat => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/proveedores')}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
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

export default CreateProveedorPage;
