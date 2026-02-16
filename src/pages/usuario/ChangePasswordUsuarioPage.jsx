import { getUsuarioById, changePasswordUsuario } from '../../services/usuarioServices';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePasswordSchema } from '../../schemas/usuario';
import ErrorMessage from '../../components/ErrorMessage';
import { getAuthUsuario } from '../../utils/auth';
const ChangePasswordUsuarioPage = () => {
    const navigate = useNavigate();
    const usuarioInfo =getAuthUsuario();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        roles: ''    
    });
     const [formDataChange, setFormDataChange] = useState({       
        newPassword:'',
        currentPassword:''
    });

    const fetchUsuario = async () => {
        try {
            const response = await getUsuarioById(usuarioInfo.id);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        fetchUsuario();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resultado = changePasswordSchema.safeParse(formDataChange);
            if (!resultado.success) {

                const listaErrores = resultado.error.issues.map(issue => ({
                    campo: issue.path[0],
                    mensaje: issue.message
                }));
                setErrors(listaErrores);
            }
            else {
                await changePasswordUsuario(usuarioInfo.id, formDataChange);
                navigate('/usuario/login');
            }

        } catch (error) {
            let serverMessage="";
            if (error.response) {
                 serverMessage = error.response.data.msg || 'Error en el servidor';               
            } else if (error.request) {
                serverMessage ='No se pudo conectar con el servidor';
                console.error(serverMessage);
            } else {
                serverMessage =error.message;
                console.error(serverMessage);
            }
             setErrors([{ campo: 'SERVER', mensaje: serverMessage }]);
        }
    }      
     const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDataChange({ ...formDataChange, [name]: value });
    };
    return (
        <div>
            <h1>Cambiar password</h1>
            <form onSubmit={handleSubmit}>
               <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        disabled
                    />
                </div>

                <div>
                    <label>Apellido:</label>
                    <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}                
                        disabled
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}                       
                        disabled
                    />
                </div>

                <div>
                    <label>Teléfono:</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}                       
                        disabled
                    />
                </div>

                <div>
                    <label>Rol:</label>
                    <select name="roles" value={formData.roles} disabled>
                        <option value="SALES">Ventas</option>
                        <option value="INVENTORY">Inventario</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formDataChange.currentPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Nueva Contraseña:</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formDataChange.newPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Cambiar password</button>
                <button type="button" onClick={() => navigate('/')}>Cancelar</button>
            </form>
              <ErrorMessage errors={errors}/>  
        </div>
    );
}
export default ChangePasswordUsuarioPage;