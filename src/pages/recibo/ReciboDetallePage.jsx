import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { 
    Box, Typography, Container, Button, Grid, 
    IconButton, Divider, Paper, Table, TableBody, 
    TableCell, TableHead, TableRow, Chip, CircularProgress 
} from '@mui/material';
import { 
    ArrowBackIosNew as BackIcon,
    FileDownload as DownloadIcon,
    Receipt as ReceiptIcon,
    CalendarMonth as DateIcon,
    Person as UserIcon,
    CheckCircleOutline as SuccessIcon
} from '@mui/icons-material';

const ReciboDetallePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recibo, setRecibo] = useState(null);
    const [detalles, setDetalles] = useState([]);
    const [loading, setLoading] = useState(true);

    const obtenerRecibo = async () => {
        try {
            const res = await axios.get(`/api/recibo/${id}`);
            setRecibo(res.data.recibo);
            setDetalles(res.data.detalles);
        } catch (error) {
            console.error("Error al cargar detalle:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerRecibo();
    }, []);

    const descargarPDF = () => {
        window.open(`/api/recibo/${id}/pdf`, "_blank");
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#fff' }}>
            <CircularProgress size={40} thickness={5} sx={{ color: '#1e40af' }} />
        </Box>
    );

    if (!recibo) return <Typography sx={{ p: 4, textAlign: 'center' }}>No se encontró el recibo.</Typography>;

    return (
        <Box sx={{ bgcolor: '#F8FAF6', minHeight: '100vh' }}>
            
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                px: 2, 
                py: 2, 
                bgcolor: '#FFFFFF',
                borderBottom: '1px solid #F1F5F9' 
            }}>
                <IconButton onClick={() => navigate('/recibo')} sx={{ color: '#1976d2' }}>
                    <BackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: '900', mr: 5 }}>
                    Detalle de Recibo
                </Typography>
            </Box>

            <Container maxWidth="md" sx={{ mt: 4, pb: 6 }}>
                
                <Paper elevation={0} sx={{ 
                    borderRadius: '24px', 
                    overflow: 'hidden', 
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                    
                    <Box sx={{ p: 4, bgcolor: '#FFFFFF' }}>
                        <Grid container justifyContent="space-between" alignItems="flex-start">
                            <Grid item>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                    <ReceiptIcon sx={{ color: '#1e40af', fontSize: 28 }} />
                                    <Typography variant="h5" fontWeight="900" sx={{ color: '#1E293B' }}>
                                        #{recibo.folio}
                                    </Typography>
                                </Box>
                                <Chip 
                                    label={recibo.estado?.toUpperCase()} 
                                    size="small"
                                    color={recibo.estado === 'pagado' ? 'success' : 'warning'}
                                    sx={{ fontWeight: '800', borderRadius: '8px' }}
                                />
                            </Grid>
                            <Grid item sx={{ textAlign: 'right' }}>
                                <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, color: '#64748B', fontWeight: '600' }}>
                                    <DateIcon fontSize="small" /> 
                                    {new Date(recibo.fecha).toLocaleDateString()}
                                </Typography>
                                <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, color: '#64748B', fontWeight: '600', mt: 0.5 }}>
                                    <UserIcon fontSize="small" /> 
                                    {recibo.usuario?.nombre || 'ID: ' + recibo.usuario}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider sx={{ mx: 4, borderStyle: 'dashed' }} />

                    {/* Tabla de Productos */}
                    <Box sx={{ p: { xs: 2, md: 4 } }}>
                        <Table sx={{ minWidth: 400 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: '800', color: '#64748B', borderBottom: '2px solid #F1F5F9' }}>Producto</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: '800', color: '#64748B', borderBottom: '2px solid #F1F5F9' }}>Cant.</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: '800', color: '#64748B', borderBottom: '2px solid #F1F5F9' }}>Subtotal</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detalles.map((d) => (
                                    <TableRow key={d._id} sx={{ '&:last-child td': { border: 0 } }}>
                                        <TableCell sx={{ fontWeight: '600', color: '#1E293B' }}>
                                            {d.producto?.nombre || 'Concepto General'}
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#64748B', fontWeight: '700' }}>
                                            {d.cantidad}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: '800', color: '#1E293B' }}>
                                            ${d.subtotal.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>

                    <Box sx={{ p: 4, bgcolor: '#F8FAFC', textAlign: 'right' }}>
                        <Typography variant="body1" sx={{ color: '#64748B', fontWeight: '700' }}>Total del Recibo</Typography>
                        <Typography variant="h3" sx={{ fontWeight: '900', color: '#1e40af', mt: 1 }}>
                            ${recibo.total.toLocaleString()}
                        </Typography>
                    </Box>
                </Paper>

                <Box sx={{ mt: 4 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<DownloadIcon />}
                        onClick={descargarPDF}
                        sx={{
                            height: '56px',
                            borderRadius: '18px',
                            textTransform: 'none',
                            fontWeight: '800',
                            fontSize: '1.1rem',
                            bgcolor: '#1E293B',
                            boxShadow: '0 10px 15px -3px rgba(30, 41, 59, 0.2)',
                            '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' }
                        }}
                    >
                        Descargar Comprobante PDF
                    </Button>
                </Box>

            </Container>
        </Box>
    );
};

export default ReciboDetallePage;