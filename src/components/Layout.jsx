import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Button,
  CssBaseline,
  Divider
} from '@mui/material';

import {
  Menu as MenuIcon,
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

const drawerWidth = 240;

const Layout = () => {
  const [usuario, setUsuario] = useState(getAuthUsuario());
  const [auth, setAuth] = useState(isAuthenticated());
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUsuario(getAuthUsuario());
    setAuth(isAuthenticated());
  }, [location]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/usuario/login');
  };

  const links = [
    { to: "/", label: "Home", icon: <Home />, public: true },

    { to: "/producto", label: "Producto", icon: <Inventory2 />, roles: ['ADMIN', 'INVENTORY', 'SALES'] },
    { to: "/movimientosInventario", label: "movimientosInventario", icon: <Store />, roles: ['ADMIN', 'INVENTORY'] },
    { to: "/recibo", label: "recibo", icon: <Receipt />, roles: ['ADMIN', 'SALES'] },
    { to: "/proveedores", label: "Proveedores", icon: <People />, roles: ['ADMIN', 'INVENTORY'] },
    { to: "/categoria", label: "Categoria", icon: <Category />, roles: ['ADMIN', 'INVENTORY'] },
    { to: "/catalogo", label: "Catalogo", icon: <Inventory2 />, roles: ['ADMIN', 'INVENTORY'] },
    { to: "/usuario", label: "Usuario", icon: <Group />, roles: ['ADMIN'] },
    { to: "/usuario/changepassword", label: "Seguridad", icon: <LockReset />, roles: ['ADMIN', 'INVENTORY', 'SALES'] },
  ];

  const drawerContent = (
    <Box>
      <Toolbar>
        <Typography fontWeight="bold" color="primary">
          MENÚ
        </Typography>
      </Toolbar>

      <Divider />

      <List>
        {links
          .filter(link => link.public || link.roles?.includes(usuario?.roles))
          .map(link => (
            <ListItem key={link.to} disablePadding>
              <ListItemButton
                component={Link}
                to={link.to}
                selected={location.pathname === link.to}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'white'
                  }
                }}
              >
                {link.icon}
                <ListItemText sx={{ ml: 2 }} primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'white',
          color: 'black',
          boxShadow: 1,
          zIndex: theme => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton onClick={handleDrawerToggle} sx={{ display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Typography sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Sistema Inventario
          </Typography>

          {auth && (
            <Typography sx={{ mr: 2 }}>
              {usuario?.nombre} | <b>{usuario?.roles}</b>
            </Typography>
          )}

          <Button
            variant="outlined"
            color={auth ? "error" : "primary"}
            startIcon={auth ? <Logout /> : <Login />}
            onClick={auth ? handleLogout : () => navigate('/usuario/login')}
          >
            {auth ? "Salir" : "Entrar"}
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth }
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth }
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        <Box
          sx={{
            bgcolor: 'white',
            p: 3,
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
