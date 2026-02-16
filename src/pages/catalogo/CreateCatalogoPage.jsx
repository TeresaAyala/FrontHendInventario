import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, TextField, Button,
  Box, Divider, IconButton, BottomNavigation, BottomNavigationAction, Stack
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBackIosNew as BackIcon,
  CloudUploadOutlined as UploadIcon,
  HomeOutlined as HomeIcon,
  Inventory2Outlined as InventoryIcon,
  AssessmentOutlined as AssessmentIcon,
  SettingsOutlined as SettingsIcon 
} from '@mui/icons-material';

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

  const styles = {
    mainContainer: {
      backgroundColor: '#FFFFFF', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      p: 2,
      backgroundColor: '#fff',
      borderBottom: '1px solid #F1F5F9' 
    },
    card: {
      m: 2,
      p: 2,
      borderRadius: '24px',
      backgroundColor: '#fff',
      flex: 1,
      mb: 12 
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '800', 
      color: '#1E293B',
      mb: 1,
      mt: 2,
      ml: 0.5
    },
    uploadArea: {
      border: '2px dashed #E2E8F0',
      borderRadius: '20px',
      p: 4,
      textAlign: 'center',
      cursor: 'pointer',
      backgroundColor: '#F8FAFC',
      transition: 'all 0.2s',
      display: 'block',
      '&:active': { backgroundColor: '#F1F5F9', transform: 'scale(0.98)' }
    },
    btnSave: {
      backgroundColor: '#1E40AF',
      color: '#fff',
      borderRadius: '16px',
      py: 1.8,
      fontWeight: '800',
      mt: 4,
      textTransform: 'none',
      fontSize: '16px',
      boxShadow: 'none', 
      '&:hover': { backgroundColor: '#1e3a8a', boxShadow: 'none' }
    }
  };

  return (
    <Box sx={styles.mainContainer}>

      <Box sx={styles.header}>
        <IconButton onClick={() => navigate('/catalogo')} size="small" sx={{ color: '#1E40AF' }}>
          <BackIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', fontWeight: 900, color: '#1E293B', mr: 4 }}>
          Nuevo Catálogo
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Paper sx={styles.card} elevation={0}>
          <Typography sx={styles.label}>Nombre del Catálogo</Typography>
          <TextField
            fullWidth
            placeholder="Ej. Colección Verano"
            variant="outlined"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            sx={{ 
                '& .MuiOutlinedInput-root': { 
                    borderRadius: '14px',
                    backgroundColor: '#F8FAFC',
                    '& fieldset': { borderColor: '#E2E8F0' }
                } 
            }}
          />

          <Typography sx={styles.label}>Descripción</Typography>
          <TextField
            fullWidth
            placeholder="Detalles del catálogo..."
            multiline
            rows={3}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            sx={{ 
                '& .MuiOutlinedInput-root': { 
                    borderRadius: '14px',
                    backgroundColor: '#F8FAFC',
                    '& fieldset': { borderColor: '#E2E8F0' }
                } 
            }}
          />

          <Typography sx={styles.label}>Imagen de Portada</Typography>
          <Box 
            component="label" 
            sx={styles.uploadArea}
          >
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
            />
            <UploadIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 1 }} />
            <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700 }}>
              {formData.imagen ? formData.imagen.name : "Subir imagen de portada"}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.5 }}>
              Formatos recomendados: JPG, PNG
            </Typography>
          </Box>

          <Button 
            fullWidth 
            variant="contained"
            disableElevation
            sx={styles.btnSave}
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
          >
            Guardar Catálogo
          </Button>

          <Button 
            fullWidth 
            variant="text" 
            sx={{ mt: 1, color: '#94A3B8', textTransform: 'none', fontWeight: 700 }}
            onClick={() => navigate('/catalogo')}
          >
            Cancelar
          </Button>

          <Box sx={{ mt: 2 }}>
            <ErrorMessage errors={errors} />
          </Box>
        </Paper>
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, borderTop: '1px solid #F1F5F9' }} elevation={0}>
        <BottomNavigation
          showLabels
          value={1}
          sx={{ 
              height: 80,
              '& .MuiBottomNavigationAction-label': { fontWeight: 700, fontSize: '0.75rem' },
              '& .Mui-selected': { color: '#1E40AF' },
              '& .MuiBottomNavigationAction-root': { color: '#94A3B8' }
          }}
        >
          <BottomNavigationAction label="Inicio" icon={<HomeIcon />} />
          <BottomNavigationAction label="Catálogo" icon={<InventoryIcon />} />
          <BottomNavigationAction label="Reportes" icon={<AssessmentIcon />} />
          <BottomNavigationAction label="Ajustes" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default CreateCatalogoPage;