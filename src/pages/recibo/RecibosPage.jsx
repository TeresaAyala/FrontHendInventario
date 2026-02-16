import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { 
    Box, 
    Typography, 
    Button, 
    Container, 
    Table, 
    TableBody, 
    TableCell, 
    TableRow, 
    IconButton, 
    Chip,
    Avatar
} from '@mui/material';
import { 
    Add as AddIcon, 
    ReceiptLong as ReceiptIcon, 
    Visibility as ViewIcon,
    ArrowBackIosNew as BackIcon
} from '@mui/icons-material';

const RecibosPage = () => {
    const [recibos, setRecibos] = useState([]);
    const navigate = useNavigate();

    const obtenerRecibos = async () => {
        try {
            const res = await axios.get("/api/recibo");
            setRecibos(Array.isArray(res.data) ? res.data : res.data.recibos || []);
        } catch (error) {
            console.error("Error al obtener recibos:", error);
        }
    };

    useEffect(() => {
        obtenerRecibos();
    }, []);

    const getStatusColor = (estado) => {
        switch (estado?.toUpperCase()) {
            case 'PAGADO': return { bg: '#DCFCE7', text: '#15803D' };
            case 'PENDIENTE': return { bg: '#FEF9C3', text: '#854D0E' };
            case 'CANCELADO': return { bg: '#FEE2E2', text: '#991B1B' };
            default: return { bg: '#F1F5F9', text: '#475569' };
        }
    };

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
                    Gestión de Recibos
                </Typography>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>

                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/recibo/create")}
                    sx={{
                        height: '56px',
                        borderRadius: '16px',
                        textTransform: 'none',
                        fontWeight: '800',
                        fontSize: '1rem',
                        bgcolor: '#1e40af',
                        mb: 4,
                        boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)',
                        '&:hover': { bgcolor: '#1e3a8a' }
                    }}
                >
                    Crear Nuevo Recibo
                </Button>

                <Box sx={{ border: '1px solid #F1F5F9', borderRadius: '20px', overflow: 'hidden' }}>
                    <Table>
                        <TableBody>
                            {recibos.length === 0 ? (
                                <TableRow>
                                    <TableCell align="center" sx={{ py: 8, color: '#94A3B8' }}>
                                        No se encontraron recibos registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                recibos.map((recibo) => {
                                    const status = getStatusColor(recibo.estado);
                                    return (
                                        <TableRow key={recibo._id} sx={{ '&:last-child td': { border: 0 } }}>
                                            
                                            <TableCell sx={{ width: 60 }}>
                                                <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6', borderRadius: '12px' }}>
                                                    <ReceiptIcon />
                                                </Avatar>
                                            </TableCell>

                                            <TableCell>
                                                <Typography variant="subtitle2" sx={{ fontWeight: '800', color: '#1E293B' }}>
                                                    Folio: {recibo.folio}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#64748B' }}>
                                                    {new Date(recibo.createdAt).toLocaleDateString('es-MX', { 
                                                        year: 'numeric', month: 'long', day: 'numeric' 
                                                    })}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="center">
                                                <Chip 
                                                    label={recibo.estado || 'S/E'} 
                                                    size="small"
                                                    sx={{ 
                                                        fontWeight: '900', 
                                                        fontSize: '10px',
                                                        bgcolor: status.bg, 
                                                        color: status.text 
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell align="right">
                                                <Typography variant="subtitle2" sx={{ fontWeight: '900', color: '#1E293B' }}>
                                                    ${Number(recibo.total).toLocaleString()}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="right" sx={{ width: 50 }}>
                                                <IconButton 
                                                    onClick={() => navigate(`/recibo/${recibo._id}`)}
                                                    sx={{ color: '#64748B', bgcolor: '#F8FAF3' }}
                                                >
                                                    <ViewIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </Container>
        </Box>
    );
};

export default RecibosPage;