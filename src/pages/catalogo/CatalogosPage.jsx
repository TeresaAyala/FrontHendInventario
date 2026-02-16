import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, IconButton, CircularProgress, 
  Snackbar, Alert, InputBase, Tabs, Tab, Avatar,
  BottomNavigation, BottomNavigationAction, Stack
} from '@mui/material';
import { 
  Search as SearchIcon, AddCircleOutline as AddIcon, ChevronRight as ChevronRightIcon,
  HomeOutlined as HomeIcon, Inventory2Outlined as InventoryIcon,
  AssessmentOutlined as AssessmentIcon, SettingsOutlined as SettingsIcon,
  ArrowBackIosNew as BackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { getCatalogos } from '../../services/catalogoServices';
import { getCategorias } from '../../services/categoriaServices'; 

const CatalogosPage = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]); 
  const [categorias, setCategorias] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Iniciando carga de datos...");

      // Llamamos a ambos servicios
      const [resProductos, resCategorias] = await Promise.all([
        getCatalogos(),
        getCategorias()
      ]);


      console.log("Productos recibidos:", resProductos.data);
      console.log("Categorías recibidas:", resCategorias.data);

      const listaProductos = resProductos.data || [];
      setProductos(listaProductos);

      let listaCategoriasNombres = (resCategorias.data || []).map(c => c.nombre);

      if (listaCategoriasNombres.length === 0 && listaProductos.length > 0) {
        console.warn("No se encontraron categorías en el módulo, extrayendo de productos...");
        listaCategoriasNombres = [...new Set(listaProductos.map(p => p.categoria))].filter(Boolean);
      }

      setCategorias(listaCategoriasNombres);

    } catch (error) {
      console.error("Error cargando datos:", error);
      setNotification({ open: true, message: 'Error de conexión con el servidor', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  
  const productosFiltrados = productos.filter((p) => {
    if (categorias.length === 0) return false;
    
    const categoriaSeleccionada = categorias[tabValue];
 
    const coincideTab = p.categoria?.trim().toLowerCase() === categoriaSeleccionada?.trim().toLowerCase();
    const coincideBusqueda = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    return coincideTab && coincideBusqueda;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', overflow: 'hidden', bgcolor: '#FFFFFF' }}>
      

      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
        <IconButton onClick={() => navigate(-1)} size="small" sx={{ color: '#1E40AF' }}>
          <BackIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', fontWeight: 900, color: '#1E293B' }}>
          Mis Catálogos
        </Typography>
        <IconButton onClick={() => navigate('/producto/create')} sx={{ color: '#1E40AF' }}>
          <AddIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Box>

      <Box sx={{ borderBottom: '1px solid #F1F5F9', minHeight: '48px' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}><CircularProgress size={20} /></Box>
        ) : categorias.length > 0 ? (
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', color: '#64748B' },
              '& .Mui-selected': { color: '#1E40AF !important' },
              '& .MuiTabs-indicator': { bgcolor: '#1E40AF', height: 3 }
            }}
          >
            {categorias.map((nombre, index) => (
              <Tab key={index} label={nombre} />
            ))}
          </Tabs>
        ) : (
          <Typography variant="body2" sx={{ p: 2, textAlign: 'center', color: '#94A3B8' }}>
            No hay categorías registradas
          </Typography>
        )}
      </Box>

      {/* BUSCADOR */}
      <Box sx={{ p: 2 }}>
        <Paper elevation={0} sx={{ p: '8px 16px', display: 'flex', alignItems: 'center', bgcolor: '#F1F5F9', borderRadius: '12px' }}>
          <SearchIcon sx={{ color: '#64748B', mr: 1, fontSize: 20 }} />
          <InputBase 
            placeholder={categorias.length > 0 ? `Buscar en ${categorias[tabValue]}...` : "Buscar..."} 
            fullWidth 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ fontWeight: 600, fontSize: '0.95rem' }}
          />
        </Paper>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pb: '90px' }}>
        {loading ? (
          null 
        ) : productosFiltrados.length > 0 ? (
          productosFiltrados.map((item) => (
            <Box 
              key={item._id} 
              onClick={() => navigate(`/producto/edit/${item._id}`)}
              sx={{ 
                display: 'flex', alignItems: 'center', py: 2, borderBottom: '1px solid #F8FAFC',
                cursor: 'pointer', '&:active': { bgcolor: '#F1F5F9' } 
              }}
            >
              <Avatar
                src={item.imagenUrl || item.imagen}
                variant="rounded"
                sx={{ width: 80, height: 80, borderRadius: '14px', mr: 2, bgcolor: '#F1F5F9' }}
              >
                {item.nombre?.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#1E293B' }}>{item.nombre}</Typography>
                <Typography variant="body2" sx={{ color: '#1E40AF', fontWeight: 800 }}>${item.precio}</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                   <Typography variant="caption" sx={{ fontWeight: 700, color: '#94A3B8' }}>SKU: {item.sku}</Typography>
                   <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
                   <Typography variant="caption" sx={{ fontWeight: 700, color: '#94A3B8' }}>STOCK: {item.cantidad}</Typography>
                </Stack>
              </Box>
              <ChevronRightIcon sx={{ color: '#CBD5E1' }} />
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>
              {categorias.length > 0 ? `No hay productos en "${categorias[tabValue]}"` : "Sin datos"}
            </Typography>
          </Box>
        )}
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, borderTop: '1px solid #F1F5F9', zIndex: 100 }} elevation={0}>
        <BottomNavigation showLabels value={1} sx={{ height: 75 }}>
          <BottomNavigationAction label="Inicio" icon={<HomeIcon />} onClick={() => navigate('/')} />
          <BottomNavigationAction label="Catálogo" icon={<InventoryIcon />} />
          <BottomNavigationAction label="Reportes" icon={<AssessmentIcon />} />
          <BottomNavigationAction label="Ajustes" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>

      <Snackbar open={notification.open} autoHideDuration={3000} onClose={() => setNotification({ ...notification, open: false })}>
        <Alert severity={notification.severity} variant="filled" sx={{ borderRadius: '12px' }}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CatalogosPage;