import { getUsuarioById, changePasswordUsuario } from '../../services/usuarioServices';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Avatar
} from '@mui/material';
import { 
  LockReset as LockIcon, 
  ArrowBackIosNew as BackIcon, 
  Security as SecurityIcon 
} from '@mui/icons-material';
import { changePasswordSchema } from '../../schemas/usuario';
import ErrorMessage from '../../components/ErrorMessage';
import { getAuthUsuario } from '../../utils/auth';

const ChangePasswordUsuarioPage = () => {
  const navigate = useNavigate();
  const usuarioInfo = getAuthUsuario();
  const [errors, setErrors] = useState([]);
  
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', roles: ''    
  });
  
  const [formDataChange, setFormDataChange] = useState({       
    newPassword: '', currentPassword: ''
  });

  const adaptableButtonStyle = {
    width: '100%', 
    minHeight: { xs: '56px', sm: '60px' }, 
    borderRadius: '16px',
    textTransform: 'none',
    fontWeight: '800',
    fontSize: { xs: '1rem', sm: '1.1rem' }, 
    boxShadow: 'none',
    display: 'flex',
    gap: 1
  };

  const fetchUsuario = async () => {
    try {
      const response = await getUsuarioById(usuarioInfo.id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => { fetchUsuario(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultado = changePasswordSchema.safeParse(formDataChange);
      if (!resultado.success) {
        setErrors(resultado.error.issues.map(i => ({ campo: i.path[0], mensaje: i.message })));
      } else {
        await changePasswordUsuario(usuarioInfo.id, formDataChange);
        navigate('/usuario/login');
      }
    } catch (error) {
      setErrors([{ campo: 'SERVER', mensaje: error.response?.data.msg || 'Error' }]);
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: { xs: 2, sm: 3 }, borderBottom: '1px solid #f0f0f0' }}>
        <IconButton onClick={() => navigate('/')} sx={{ color: '#1976d2' }}>
          <BackIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: '900', mr: 5 }}>
          Seguridad
        </Typography>
      </Box>

      <Box sx={{ 
        p: { xs: 2, sm: 4 }, 
        width: '100%', 
        maxWidth: '800px', 
        margin: '0 auto' 
      }}>
        
        <Paper elevation={0} sx={{ 
          p: 3, mb: 4, borderRadius: '24px', display: 'flex', alignItems: 'center', gap: 2,
          bgcolor: '#f8fafc', border: '1px solid #f1f5f9'
        }}>
          <Avatar sx={{ bgcolor: '#dbeafe', color: '#1e40af', width: { xs: 50, sm: 60 }, height: { xs: 50, sm: 60 } }}>
            <SecurityIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
              {formData.nombre} {formData.apellido}
            </Typography>
            <Typography variant="body2" color="text.secondary">{formData.roles}</Typography>
          </Box>
        </Paper>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 4 } }}>
            <TextField
              fullWidth
              label="Contraseña Actual"
              type="password"
              value={formDataChange.currentPassword}
              onChange={(e) => setFormDataChange({...formDataChange, currentPassword: e.target.value})}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
            />

            <TextField
              fullWidth
              label="Nueva Contraseña"
              type="password"
              value={formDataChange.newPassword}
              onChange={(e) => setFormDataChange({...formDataChange, newPassword: e.target.value})}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
            />

            <ErrorMessage errors={errors} />

            <Box sx={{ 
              mt: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              width: '100%' 
            }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<LockIcon />}
                sx={{ 
                  ...adaptableButtonStyle,
                  bgcolor: '#1976d2',
                  '&:hover': { bgcolor: '#1565c0' }
                }}
              >
                Actualizar Contraseña
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                sx={{ 
                  ...adaptableButtonStyle,
                  color: '#64748b',
                  borderColor: '#e2e8f0',
                  borderWidth: '2px',
                  '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc', borderWidth: '2px' }
                }}
              >
                Volver al Inicio
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ChangePasswordUsuarioPage;