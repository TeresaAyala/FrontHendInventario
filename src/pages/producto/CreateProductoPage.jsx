import { createProducto } from '../../services/productoServices';

import { getCategorias } from '../../services/categoriaServices'; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoZodSchema } from '../../schemas/producto';
import ErrorMessage from '../../components/ErrorMessage';

import { 
    Box, Typography, TextField, Button, MenuItem, 
    IconButton, Container, Avatar, InputAdornment 
} from '@mui/material';
import { 
    ArrowBackIosNew as BackIcon, 
    Inventory2 as InventoryIcon,
    Save as SaveIcon
} from '@mui/icons-material';

const CreateProductoPage = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [categorias, setCategorias] = useState([]); 

    const [formData, setFormData] = useState({
        nombre: '',
        categoria: '',
        precio: '',
        cantidad: '',
        estadoStock: 'DISPONIBLE'
    });

    
    useEffect(() => {
       
        const cargarCategorias = async () => {
            const data = await getCategorias();
            setCategorias(data);
            setCategorias(['Tecnologia', 'Hogar', 'Oficina']);
        };
        cargarCategorias();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
       
        const datosParaEnviar = {
            ...formData,
           
            precio: Number(formData.precio),
            cantidad: Number(formData.cantidad),
           
            sku: `PROD-${Date.now()}`, 
            
            imagen: "https://via.placeholder.com/150" 
        };

        const resultado = productoZodSchema.safeParse(datosParaEnviar);

        if (!resultado.success) {
            setErrors(resultado.error.issues.map(issue => ({
                campo: issue.path[0],
                mensaje: issue.message
            })));
            return;
        }

        try {
            await createProducto(datosParaEnviar);
            navigate('/producto');
        } catch (error) {
            let serverMessage = error.response?.data.error || 'Error al conectar con el servidor';
            setErrors([{ campo: 'SERVER', mensaje: serverMessage }]);
        }
    };

    return (
        <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2, borderBottom: '1px solid #F1F5F9' }}>
                <IconButton onClick={() => navigate('/producto')} sx={{ color: '#1976d2' }}>
                    <BackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: '900', mr: 5 }}>
                    Nuevo Producto
                </Typography>
            </Box>

            <Container maxWidth="sm" sx={{ mt: 4, pb: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <Avatar sx={{ bgcolor: '#eff6ff', color: '#1e40af', width: 70, height: 70, mb: 1.5 }}>
                        <InventoryIcon sx={{ fontSize: 35 }} />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: '600' }}>
                        Completa los detalles del inventario
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        
                        <TextField
                            fullWidth
                            label="Nombre del Producto"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                        />

                       
                        <TextField
                            select
                            fullWidth
                            label="Categoría"
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                        >
                            {categorias.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Precio"
                                name="precio"
                                type="number"
                                value={formData.precio}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Cantidad Inicial"
                                name="cantidad"
                                type="number"
                                value={formData.cantidad}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                            />
                        </Box>

                        <TextField
                            select
                            fullWidth
                            label="Estado de Stock"
                            name="estadoStock"
                            value={formData.estadoStock}
                            onChange={handleChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                        >
                            <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
                            <MenuItem value="AGOTADO">AGOTADO</MenuItem>
                        </TextField>

                        <Box sx={{ mt: 1 }}>
                            <ErrorMessage errors={errors} />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            sx={{ 
                                width: '100%', height: '56px', borderRadius: '16px', 
                                textTransform: 'none', fontWeight: '800', bgcolor: '#10b981',
                                '&:hover': { bgcolor: '#059669' }
                            }}
                        >
                            Registrar Producto
                        </Button>
                    </Box>
                </form>
            </Container>
        </Box>
    );
};

export default CreateProductoPage;