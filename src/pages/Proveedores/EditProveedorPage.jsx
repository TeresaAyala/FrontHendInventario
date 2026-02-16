import React,{useEffect,useState} from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import {
  Container,Paper,Typography,TextField,
  Button,Grid,Stack,Divider,MenuItem
} from '@mui/material';

import { getProveedorById, updateProveedor } from '../../services/proveedoresServices';
import { getCategorias } from '../../services/categoriaServices';
import ErrorMessage from '../../components/ErrorMessage';

const EditProveedorPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [errors,setErrors]=useState([]);
  const [categorias,setCategorias] = useState([]);

  const [formData,setFormData]=useState({
    nombre:'',
    contacto:'',
    telefono:'',
    email:'',
    direccion:'',
    categoria:''
  });

  useEffect(()=>{
    const fetchData = async () => {
      const proveedorRes = await getProveedorById(id);
      const categoriasRes = await getCategorias();

      setFormData({
        ...proveedorRes.data,
        categoria: proveedorRes.data.categoria?._id || ''
      });

      setCategorias(categoriasRes.data);
    };

    fetchData();
  },[id]);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      await updateProveedor(id,formData);
      navigate('/proveedores');
    }catch{
      setErrors([{campo:'SERVER',mensaje:'Error al actualizar'}]);
    }
  };

  return(
    <Container maxWidth="sm" sx={{mt:8}}>
      <Paper sx={{p:4}}>
        <Typography variant="h4" align="center" fontWeight="bold">
          Editar Proveedor
        </Typography>

        <Divider sx={{my:3}}/>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              <TextField label="Nombre" fullWidth required
                value={formData.nombre}
                onChange={e=>setFormData({...formData,nombre:e.target.value})}/>
            </Grid>

            <Grid item xs={12}>
              <TextField label="Contacto" fullWidth
                value={formData.contacto}
                onChange={e=>setFormData({...formData,contacto:e.target.value})}/>
            </Grid>

            <Grid item xs={12}>
              <TextField label="Teléfono" fullWidth
                value={formData.telefono}
                onChange={e=>setFormData({...formData,telefono:e.target.value})}/>
            </Grid>

            <Grid item xs={12}>
              <TextField label="Email" fullWidth
                value={formData.email}
                onChange={e=>setFormData({...formData,email:e.target.value})}/>
            </Grid>

            <Grid item xs={12}>
              <TextField label="Dirección" fullWidth
                value={formData.direccion}
                onChange={e=>setFormData({...formData,direccion:e.target.value})}/>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Categoría"
                fullWidth
                required
                value={formData.categoria}
                onChange={e=>setFormData({...formData,categoria:e.target.value})}
              >
                {categorias.map(cat => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button fullWidth variant="outlined"
                  onClick={()=>navigate('/proveedores')}>
                  Cancelar
                </Button>
                <Button type="submit" fullWidth variant="contained">
                  Actualizar
                </Button>
              </Stack>
            </Grid>

          </Grid>
        </form>

        <ErrorMessage errors={errors}/>
      </Paper>
    </Container>
  );
};

export default EditProveedorPage;
