import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField,
  Button, Grid, Stack, Divider, CircularProgress, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

import { getCategoriaById, updateCategoria } from '../../services/categoriaServices';
import ErrorMessage from '../../components/ErrorMessage';

const EditCategoriaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const res = await getCategoriaById(id);
        setFormData({
          nombre: res.data.nombre || '',
          descripcion: res.data.descripcion || ''
        });
      } catch {
        setErrors([{ campo: 'SERVER', mensaje: 'No se pudo cargar la categoría' }]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoria();
  }, [id]);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await updateCategoria(id, formData);
      navigate('/categoria');
    } catch {
      setErrors([{ campo: 'SERVER', mensaje: 'Error al actualizar' }]);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" fontWeight="bold">
          Editar Categoría
        </Typography>

        <Divider sx={{ my: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                multiline
                rows={3}
                value={formData.descripcion}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<EditIcon />}
                  type="submit"
                >
                  Actualizar
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => navigate('/categoria')}
                >
                  Cancelar
                </Button>
              </Stack>
            </Grid>

          </Grid>
        </form>

        <Box mt={3}>
          <ErrorMessage errors={errors} />
        </Box>
      </Paper>
    </Container>
  );
};

export default EditCategoriaPage;
