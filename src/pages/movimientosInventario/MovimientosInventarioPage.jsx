import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableRow, TableCell, TableBody, 
  CircularProgress, Box, IconButton, Avatar, Chip
} from '@mui/material';
import { 
  ArrowBackIosNew as BackIcon,
  SwapVert as MovimientoIcon,
  ArrowUpward as EntradaIcon,
  ArrowDownward as SalidaIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getMovimientosInventario } from '../../services/movimientosInventarioServices';

const MovimientosInventarioPage = () => {
  const navigate = useNavigate();
  const [movimientosInventario, setMovimientosInventario] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovimientosInventario = async () => {
    try {
      const res = await getMovimientosInventario();
      setMovimientosInventario(res.data);
    } catch (error) {
      console.error('Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovimientosInventario();
  }, []);

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        px: 2, 
        py: 2, 
        borderBottom: '1px solid #F1F5F9' 
      }}>
        <IconButton onClick={() => navigate('/')} sx={{ color: '#1976d2' }}>
          <BackIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: '900', mr: 5 }}>
          Historial de Movimientos
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        
        <Box sx={{ 
          border: '1px solid #F1F5F9', 
          borderRadius: '20px', 
          overflow: 'hidden',
          bgcolor: '#FFFFFF'
        }}>
          <Table>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <CircularProgress size={30} sx={{ color: '#1e40af' }} />
                  </TableCell>
                </TableRow>
              ) : movimientosInventario.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Typography color="text.secondary">No hay movimientos registrados</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                movimientosInventario.map(mov => (
                  <TableRow key={mov._id} sx={{ '&:last-child td': { border: 0 } }}>
                    
                    <TableCell sx={{ width: 60 }}>
                      <Avatar sx={{ 
                        bgcolor: mov.tipo === 'ENTRADA' ? '#F0FDF4' : '#FEF2F2', 
                        color: mov.tipo === 'ENTRADA' ? '#16A34A' : '#DC2626',
                        borderRadius: '12px' 
                      }}>
                        {mov.tipo === 'ENTRADA' ? <EntradaIcon /> : <SalidaIcon />}
                      </Avatar>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#1E293B' }}>
                        {mov.producto?.nombre || 'Producto eliminado'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        Realizado por: {mov.usuario?.nombre || 'Sistema'}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Chip 
                        label={mov.tipo} 
                        size="small"
                        sx={{ 
                          fontSize: '10px', 
                          fontWeight: '900',
                          bgcolor: mov.tipo === 'ENTRADA' ? '#DCFCE7' : '#FEE2E2',
                          color: mov.tipo === 'ENTRADA' ? '#15803D' : '#991B1B'
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#1E293B' }}>
                        {mov.tipo === 'ENTRADA' ? '+' : '-'}{mov.cantidad} uds
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        {new Date(mov.fecha).toLocaleDateString()} • {new Date(mov.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </Typography>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>

      </Container>
    </Box>
  );
};

export default MovimientosInventarioPage;
