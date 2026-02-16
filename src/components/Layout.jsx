import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  CssBaseline,
  Paper,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';

import {
  Home,
  Inventory2,
  Receipt,
  People,
  Category,
  Store,
  Group,
  LockReset,
  Logout,
  Login
} from '@mui/icons-material';

import { getAuthUsuario, isAuthenticated } from '../utils/auth';

const Layout = () => {
  const [usuario, setUsuario] = useState(getAuthUsuario());
  const [auth, setAuth] = useState(isAuthenticated());

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUsuario(getAuthUsuario());
    setAuth(isAuthenticated());
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/usuario/login');
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path.includes('/producto')) return 1;
    if (path.includes('/movimientosInventario')) return 2;
    if (path.includes('/recibo')) return 3;
    if (path.includes('/proveedores')) return 4;
    if (path.includes('/categoria')) return 5;
    if (path.includes('/catalogo')) return 6;
    if (path.includes('/usuario') && !path.includes('password')) return 7;
    if (path.includes('/changepassword')) return 8;
    return 0;
  };

  const tienePermiso = (rolesPermitidos) => {
    if (!rolesPermitidos) return true; 
    return rolesPermitidos.includes(usuario?.roles);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'white' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'white',
          color: 'black',
          borderBottom: '1px solid #f0f0f0',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: '900', fontSize: '1.2rem', color: '#1a1a1a' }}>
            Inventario
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {auth && (
              <Typography sx={{ mr: 2, fontSize: '0.8rem', display: { xs: 'none', sm: 'block' }, color: '#666' }}>
                {usuario?.nombre} | <b>{usuario?.roles}</b>
              </Typography>
            )}

            <Button
              variant="contained"
              disableElevation
              color={auth ? "error" : "primary"}
              startIcon={auth ? <Logout /> : <Login />}
              onClick={auth ? handleLogout : () => navigate('/usuario/login')}
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 'bold', px: 3 }}
            >
              {auth ? "Salir" : "Entrar"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          mt: '64px',
          mb: '75px',
          p: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Outlet />
      </Box>

      {auth && (
        <Paper 
          elevation={0} 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1000,
            borderTop: '1px solid #eee',
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none' 
          }}
        >
          <BottomNavigation
            showLabels
            value={getActiveTab()}
            sx={{ 
              height: 75, 
              width: 'max-content',
              minWidth: '100%',
              '& .MuiBottomNavigationAction-root': { 
                minWidth: 85,
                color: '#999',
                '&.Mui-selected': { color: '#1976d2' }
              }
            }}
          >
            <BottomNavigationAction label="Inicio" icon={<Home />} onClick={() => navigate('/')} />
            
            {tienePermiso(['ADMIN', 'INVENTORY', 'SALES']) && 
              <BottomNavigationAction label="Producto" icon={<Inventory2 />} onClick={() => navigate('/producto')} />}
            
            {tienePermiso(['ADMIN', 'INVENTORY']) && 
              <BottomNavigationAction label="Movs." icon={<Store />} onClick={() => navigate('/movimientosInventario')} />}
            
            {tienePermiso(['ADMIN', 'SALES']) && 
              <BottomNavigationAction label="Recibo" icon={<Receipt />} onClick={() => navigate('/recibo')} />}
            
            {tienePermiso(['ADMIN', 'INVENTORY']) && 
              <BottomNavigationAction label="Provs." icon={<People />} onClick={() => navigate('/proveedores')} />}
            
            {tienePermiso(['ADMIN', 'INVENTORY']) && 
              <BottomNavigationAction label="Cats." icon={<Category />} onClick={() => navigate('/categoria')} />}
            
            {tienePermiso(['ADMIN', 'INVENTORY']) && 
              <BottomNavigationAction label="Catálogo" icon={<Inventory2 />} onClick={() => navigate('/catalogo')} />}
            
            {tienePermiso(['ADMIN']) && 
              <BottomNavigationAction label="Usuario" icon={<Group />} onClick={() => navigate('/usuario')} />}
            
            {tienePermiso(['ADMIN', 'INVENTORY', 'SALES']) && 
              <BottomNavigationAction label="Seguridad" icon={<LockReset />} onClick={() => navigate('/usuario/changepassword')} />}
            
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default Layout;