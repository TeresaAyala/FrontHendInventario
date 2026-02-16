import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField,
  Button, Box, Grid, Divider, Stack, IconButton
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBackIosNew as BackIcon,
  Category as CategoryIcon 
} from '@mui/icons-material';

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
      navigate('/categoria');
    } catch (error) {
      const message = error.response?.data?.error || 'Error del servidor';
      setErrors([{ campo: 'SERVER', mensaje: message }]);
    }
  };

  const hasError = (field) => errors.some(e => e.campo === field);

  return (

    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', pb: 10 }}>
      
      <Box sx={{ bgcolor: '#FFF', px: 2, py: 1.5, display: 'flex', alignItems: 'center', borderBottom: '1px solid #F1F5F9', mb: 4 }}>
        <IconButton onClick={() => navigate('/categorias')} sx={{ color: '#1E40AF' }}>
          <BackIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 900, textAlign: 'center', mr: 5 }}>
          Nueva Categoría
        </Typography>
      </Box>

      <Container maxWidth="sm">
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            bgcolor: 'transparent', 
            borderRadius: '24px' 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, justifyContent: 'center' }}>
            <CategoryIcon sx={{ color: '#1E40AF', fontSize: 30 }} />
            <Typography variant="h5" fontWeight="900" color="#1E293B">
              Registrar Categoría
            </Typography>
          </Box>

          <Divider sx={{ mb: 4, borderColor: '#F1F5F9' }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre de la Categoría"
                  placeholder="Ej: Electrónica, Limpieza..."
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  error={hasError('nombre')}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  placeholder="Breve descripción del grupo de productos"
                  multiline
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  error={hasError('descripcion')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disableElevation
                    startIcon={<SaveIcon />}
                    sx={{ 
                      height: '56px', borderRadius: '16px', bgcolor: '#1E40AF', 
                      fontWeight: 800, textTransform: 'none', fontSize: '1rem',
                      '&:hover': { bgcolor: '#1e3a8a' } 
                    }}
                  >
                    Guardar Categoría
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/categoria')}
                    sx={{ 
                      height: '56px', borderRadius: '16px', color: '#64748B', 
                      borderColor: '#E2E8F0', fontWeight: 800, textTransform: 'none', 
                      fontSize: '1rem', '&:hover': { borderColor: '#CBD5E1', bgcolor: '#F8FAFC' } 
                    }}
                  >
                    Cancelar
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
    </Box>
  );
};

export default CreateCategoriaPage;
