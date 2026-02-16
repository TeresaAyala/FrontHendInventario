import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    CircularProgress,
    Snackbar,
    Alert,
    MenuItem
} from "@mui/material";

import { getProductoById, updateProducto } from "../../services/productoServices";

const EditProductoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        nombre: "",
        categoria: "",
        sku: "",
        precio: "",
        cantidad: "",
        imagen: "",
        estadoStock: "DISPONIBLE"
    });

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const showNotification = (message, severity = "success") => {
        setNotification({ open: true, message, severity });
    };

    const handleCloseSnackbar = () =>
        setNotification({ ...notification, open: false });

    const fetchProducto = async () => {
        try {
            const res = await getProductoById(id);
            setFormData(res.data);
        } catch {
            showNotification("Error al cargar producto", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProducto(id, formData);
            showNotification("Producto actualizado correctamente");
            setTimeout(() => navigate("/producto"), 1200);
        } catch {
            showNotification("No se pudo actualizar", "error");
        }
    };

    useEffect(() => {
        fetchProducto();
    }, []);

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 2 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Editar Producto
            </Typography>

            <Paper elevation={3} sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                value={formData.nombre}
                                onChange={(e) =>
                                    setFormData({ ...formData, nombre: e.target.value })
                                }
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Categoría"
                                value={formData.categoria}
                                onChange={(e) =>
                                    setFormData({ ...formData, categoria: e.target.value })
                                }
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="SKU"
                                value={formData.sku}
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Precio"
                                value={formData.precio}
                                onChange={(e) =>
                                    setFormData({ ...formData, precio: e.target.value })
                                }
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Cantidad"
                                value={formData.cantidad}
                                onChange={(e) =>
                                    setFormData({ ...formData, cantidad: e.target.value })
                                }
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Imagen (URL)"
                                value={formData.imagen || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, imagen: e.target.value })
                                }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Estado"
                                value={formData.estadoStock}
                                onChange={(e) =>
                                    setFormData({ ...formData, estadoStock: e.target.value })
                                }
                            >
                                <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
                                <MenuItem value="AGOTADO">AGOTADO</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                            >
                                Guardar Cambios
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate("/producto")}
                            >
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
            >
                <Alert severity={notification.severity} onClose={handleCloseSnackbar}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default EditProductoPage;
