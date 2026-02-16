import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Container, Paper, Typography, TextField,
  Button, Stack, Snackbar, Alert
} from '@mui/material';

import { createRoles } from '../../services/rolesServices';

const CreateRolesPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const [notification, setNotification] = useState({ open:false, message:'', severity:'success' });

  const showNotification = (message, severity='success') =>
    setNotification({ open:true, message, severity });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createRoles(formData);
      showNotification('Rol creado correctamente');
      setTimeout(()=>navigate('/roles'), 1200);
    } catch {
      showNotification('Error al crear rol','error');
    }
  };

  return (
    <Container sx={{ mt:4 }}>
      <Paper sx={{ p:3 }}>
        <Typography variant="h5" mb={2}>
          Crear Rol
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              fullWidth
            />

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained">
                Guardar
              </Button>

              <Button
                variant="outlined"
                onClick={()=>navigate('/roles')}
              >
                Cancelar
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={()=>setNotification({...notification, open:false})}
      >
        <Alert severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateRolesPage;
