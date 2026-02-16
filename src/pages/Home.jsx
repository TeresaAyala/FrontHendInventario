import React, { useState } from 'react';
import { 
  Box, Typography, Container, Grid, Card, CardContent, 
  Avatar, ButtonBase, Divider, List, ListItem, ListItemText, ListItemAvatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import GroupIcon from '@mui/icons-material/Group';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import SecurityIcon from '@mui/icons-material/Security';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Home = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Usuarios', count: '12', icon: <GroupIcon />, color: '#1e40af', path: '/usuario' },
    { label: 'Productos', count: '450', icon: <Inventory2Icon />, color: '#10b981', path: '/productos' },
    { label: 'Categorías', count: '8', icon: <CategoryIcon />, color: '#f59e0b', path: '/categorias' },
    { label: 'Seguridad', count: 'Ok', icon: <SecurityIcon />, color: '#6366f1', path: '/usuario/seguridad' },
  ];

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pb: 5 }}>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        p: 2, 
        alignItems: 'center', 
        bgcolor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid #EDEDED'
      }}>
        <Typography variant="h6" fontWeight="900" sx={{ color: '#1e40af' }}>SISTEMA INVENTARIO</Typography>
        <NotificationsNoneIcon sx={{ color: 'text.secondary' }} />
      </Box>

      <Container maxWidth="md">
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-1px', mb: 1, color: '#1a1a1a' }}>
            Resumen del Proyecto
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Estado actual de tu inventario y equipo.
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <ButtonBase 
                onClick={() => navigate(stat.path)}
                sx={{ width: '100%', textAlign: 'left', borderRadius: '20px' }}
              >
                <Card sx={{ 
                  width: '100%', 
                  borderRadius: '20px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  border: '1px solid #EDEDED',
                  transition: '0.2s',
                  '&:active': { transform: 'scale(0.95)', bgcolor: '#f1f5f9' }
                }}>
                  <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color, mb: 1, width: 45, height: 45 }}>
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h5" fontWeight="900">{stat.count}</Typography>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">{stat.label}</Typography>
                  </CardContent>
                </Card>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" fontWeight="800" sx={{ mb: 2, px: 1 }}>Módulos Principales</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          <ModuleButton 
            title="Gestión de Usuarios" 
            desc="Control de personal y permisos" 
            icon={<GroupIcon />} 
            color="#1e40af"
            onClick={() => navigate('/usuario')}
          />
          <ModuleButton 
            title="Inventario de Productos" 
            desc="Stock, precios y descripciones" 
            icon={<Inventory2Icon />} 
            color="#10b981"
            onClick={() => navigate('/productos')}
          />
        </Box>

        <Typography variant="h6" fontWeight="800" sx={{ mb: 2, px: 1 }}>Estado del Sistema</Typography>
        <Card sx={{ borderRadius: '24px', border: '1px solid #EDEDED', boxShadow: 'none' }}>
          <List disablePadding>
            <ListItem sx={{ py: 2 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#ecfdf5' }}>
                  <TrendingUpIcon sx={{ color: '#10b981' }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={<Typography fontWeight="bold">Servidor Activo</Typography>}
                secondary="Sincronización en tiempo real funcionando"
              />
              <Box sx={{ width: 10, height: 10, bgcolor: '#10b981', borderRadius: '50%' }} />
            </ListItem>
            <Divider variant="middle" />
            <ListItem sx={{ py: 2 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#eff6ff' }}>
                  <SecurityIcon sx={{ color: '#1e40af' }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={<Typography fontWeight="bold">Base de Datos</Typography>}
                secondary="Último respaldo: Hace 5 minutos"
              />
            </ListItem>
          </List>
        </Card>

      </Container>
    </Box>
  );
};

const ModuleButton = ({ title, desc, icon, color, onClick }) => (
  <ButtonBase onClick={onClick} sx={{ width: '100%', borderRadius: '16px' }}>
    <Card sx={{ 
      width: '100%', 
      borderRadius: '16px', 
      border: '1px solid #EDEDED',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      display: 'flex',
      alignItems: 'center',
      p: 2
    }}>
      <Avatar sx={{ bgcolor: `${color}10`, color: color, mr: 2, borderRadius: '12px' }}>
        {icon}
      </Avatar>
      <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
        <Typography variant="subtitle1" fontWeight="800">{title}</Typography>
        <Typography variant="caption" color="text.secondary">{desc}</Typography>
      </Box>
      <ChevronRightIcon sx={{ color: '#ccc' }} />
    </Card>
  </ButtonBase>
);

export default Home;