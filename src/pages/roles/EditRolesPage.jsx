import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Container, Paper, Typography, TextField,
  Button, Stack, Snackbar, Alert, CircularProgress
} from '@mui/material';

import { getRolesById, updateRoles } from '../../services/rolesServices';

const EditRolesPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open:false, message:'', severity:'success' });

  const showNotification = (message, severity='success') =>
    setNotification({ open:true, message, severity });

  const fetchRoles = async () => {
    try {
      const res = await getRolesById(id);
      setFormData(res.data);
    } catch {
      showNotification('Error al cargar rol','error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchRoles(); },[]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateRoles(id, formData);
      showNotification('Rol actualizado');
      setTimeout(()=>navigate('/roles'), 1200);
    } catch {
      showNotification('Error al actualizar','error');
    }
  };

  if(loading) return <CircularProgress sx={{ m:4 }} />;

  return (
    <Container sx={{ mt:4 }}>
      <Paper sx={{ p:3 }}>
        <Typography variant="h5" mb={2}>
          Editar Rol
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
                Actualizar
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

export default EditRolesPage;
