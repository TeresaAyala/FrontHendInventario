import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { 
    Box, Typography, Container, TextField, Button, 
    Grid, IconButton, Divider, Paper, InputAdornment,
    Autocomplete 
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

    // Estados
    const [folio, setFolio] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("Administrador | ADMIN"); // Nombre fijo o de sesión
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [catalogoProductos, setCatalogoProductos] = useState([]);

    // 1. Efecto para inicializar datos
    useEffect(() => {
        const inicializarFormulario = async () => {
            try {
                // Obtener productos para el selector
                const resProd = await axios.get("/api/producto");
                setCatalogoProductos(resProd.data.data || []);

                // Generar Folio Automático (Basado en timestamp o contador)
                const nuevoFolio = `REC-${Date.now().toString().slice(-6)}`;
                setFolio(nuevoFolio);
            } catch (error) {
                console.error("Error al inicializar:", error);
            }
        };
        inicializarFormulario();
    }, []);

    const agregarFilaProducto = () => {
        setProductosSeleccionados([
            ...productosSeleccionados,
            { id: "", nombre: "", cantidad: 1, precio: 0 }
        ]);
    };

    const eliminarProducto = (index) => {
        setProductosSeleccionados(productosSeleccionados.filter((_, i) => i !== index));
    };

    const handleSelectProducto = (index, seleccion) => {
        const nuevasFilas = [...productosSeleccionados];
        if (seleccion) {
            nuevasFilas[index] = {
                ...nuevasFilas[index],
                id: seleccion.id || seleccion._id,
                nombre: seleccion.nombre,
                precio: seleccion.precio || 0 // Autocompleta el precio
            };
        }
        setProductosSeleccionados(nuevasFilas);
    };

    const handleCantidadChange = (index, valor) => {
        const nuevasFilas = [...productosSeleccionados];
        nuevasFilas[index].cantidad = valor;
        setProductosSeleccionados(nuevasFilas);
    };

    const guardarRecibo = async () => {
        if (productosSeleccionados.length === 0) {
            alert("Agrega al menos un producto");
            return;
        }
        try {
            await axios.post("/api/recibo", { 
                folio, 
                usuario: nombreUsuario, 
                productos: productosSeleccionados 
            });
            navigate("/recibo");
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    return (
        <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2, borderBottom: '1px solid #F1F5F9' }}>
                <IconButton onClick={() => navigate('/recibo')} sx={{ color: '#1976d2' }}>
                    <BackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: '900', mr: 5 }}>
                    Nuevo Recibo
                </Typography>
            </Box>

            <Container maxWidth="md" sx={{ mt: 4, pb: 6 }}>
                {/* Información General */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="900" gutterBottom sx={{ color: '#1E293B' }}>
                        Información General
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Folio (Automático)"
                                value={folio}
                                InputProps={{
                                    readOnly: true, // No se puede editar manualmente
                                    startAdornment: <InputAdornment position="start"><FolioIcon color="primary"/></InputAdornment>,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', bgcolor: '#f8fafc' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Usuario"
                                value={nombreUsuario}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: <InputAdornment position="start"><UserIcon color="primary"/></InputAdornment>,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', bgcolor: '#f8fafc' } }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Sección de Productos */}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="900" sx={{ color: '#1E293B' }}>
                        Productos / Conceptos
                    </Typography>
                    <Button startIcon={<AddIcon />} onClick={agregarFilaProducto} sx={{ fontWeight: '800' }}>
                        Agregar ítem
                    </Button>
                </Box>

                {productosSeleccionados.map((item, index) => (
                    <Paper key={index} elevation={0} sx={{ p: 2, mb: 2, borderRadius: '16px', border: '1px solid #F1F5F9', bgcolor: '#FBFDFF' }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={5}>
                                <Autocomplete
                                    options={catalogoProductos}
                                    getOptionLabel={(option) => option.nombre || ""}
                                    onChange={(e, val) => handleSelectProducto(index, val)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Seleccionar Producto" size="small" />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={5} sm={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    label="Cant."
                                    value={item.cantidad}
                                    onChange={(e) => handleCantidadChange(index, e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={5} sm={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Precio"
                                    value={item.precio}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2} sm={1}>
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
                        sx={{ height: '56px', borderRadius: '16px', fontWeight: '800' }}
                    >
                        Generar Recibo
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default CreateReciboPage;