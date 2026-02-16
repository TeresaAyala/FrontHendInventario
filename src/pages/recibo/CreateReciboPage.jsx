import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { 
    Box, Typography, Container, TextField, Button, 
    Grid, IconButton, Divider, Paper, InputAdornment 
} from '@mui/material';
import { 
    ArrowBackIosNew as BackIcon,
    Add as AddIcon,
    DeleteOutline as DeleteIcon,
    Save as SaveIcon,
    Badge as FolioIcon,
    Person as UserIcon,
    ShoppingCart as ProductIcon,
    AttachMoney as MoneyIcon
} from '@mui/icons-material';

const CreateReciboPage = () => {
    const navigate = useNavigate();

    const [folio, setFolio] = useState("");
    const [usuario, setUsuario] = useState("");
    const [productos, setProductos] = useState([]);

    const actionButtonStyle = {
        height: '56px',
        borderRadius: '16px',
        textTransform: 'none',
        fontWeight: '800',
        fontSize: '1rem',
        boxShadow: 'none',
    };

    const agregarProducto = () => {
        setProductos([
            ...productos,
            { producto: "", cantidad: 1, precio: 0 }
        ]);
    };

    const eliminarProducto = (index) => {
        const nuevos = productos.filter((_, i) => i !== index);
        setProductos(nuevos);
    };

    const handleProductoChange = (index, field, value) => {
        const nuevos = [...productos];
        nuevos[index][field] = value;
        setProductos(nuevos);
    };

    const guardarRecibo = async () => {
        if (!folio || !usuario || productos.length === 0) {
            alert("Por favor completa los datos y agrega al menos un producto.");
            return;
        }
        try {
            await axios.post("/api/recibo", { folio, usuario, productos });
            navigate("/recibo");
        } catch (error) {
            console.error("Error al guardar:", error);
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
                <IconButton onClick={() => navigate('/recibo')} sx={{ color: '#1976d2' }}>
                    <BackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: '900', mr: 5 }}>
                    Nuevo Recibo
                </Typography>
            </Box>

            <Container maxWidth="md" sx={{ mt: 4, pb: 6 }}>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="900" gutterBottom sx={{ color: '#1E293B', ml: 1 }}>
                        Información General
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Folio"
                                value={folio}
                                onChange={(e) => setFolio(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><FolioIcon sx={{color:'#94A3B8'}}/></InputAdornment>,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="ID Usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><UserIcon sx={{color:'#94A3B8'}}/></InputAdornment>,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="900" sx={{ color: '#1E293B', ml: 1 }}>
                        Productos / Conceptos
                    </Typography>
                    <Button 
                        startIcon={<AddIcon />} 
                        onClick={agregarProducto}
                        sx={{ fontWeight: '800', textTransform: 'none', borderRadius: '10px' }}
                    >
                        Agregar ítem
                    </Button>
                </Box>

                {productos.length === 0 && (
                    <Box sx={{ p: 4, textAlign: 'center', border: '2px dashed #F1F5F9', borderRadius: '20px' }}>
                        <Typography color="text.secondary">No hay productos añadidos</Typography>
                    </Box>
                )}

                {productos.map((item, index) => (
                    <Paper 
                        key={index} 
                        elevation={0} 
                        sx={{ 
                            p: 2, 
                            mb: 2, 
                            borderRadius: '16px', 
                            border: '1px solid #F1F5F9',
                            bgcolor: '#FBFDFF'
                        }}
                    >
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={5}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="ID Producto"
                                    value={item.producto}
                                    onChange={(e) => handleProductoChange(index, "producto", e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><ProductIcon fontSize="small" sx={{color:'#94A3B8'}}/></InputAdornment>,
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fff' } }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    placeholder="Cant."
                                    value={item.cantidad}
                                    onChange={(e) => handleProductoChange(index, "cantidad", e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fff' } }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    placeholder="Precio"
                                    value={item.precio}
                                    onChange={(e) => handleProductoChange(index, "precio", e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><MoneyIcon fontSize="small" sx={{color:'#94A3B8'}}/></InputAdornment>,
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fff' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={1} sx={{ textAlign: 'right' }}>
                                <IconButton onClick={() => eliminarProducto(index)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Paper>
                ))}

                <Box sx={{ mt: 5 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={guardarRecibo}
                        sx={{ 
                            ...actionButtonStyle,
                            bgcolor: '#1e40af',
                            '&:hover': { bgcolor: '#1e3a8a' }
                        }}
                    >
                        Generar Recibo
                    </Button>
                </Box>

            </Container>
        </Box>
    );
};

export default CreateReciboPage;