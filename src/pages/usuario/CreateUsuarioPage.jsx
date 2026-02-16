import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioZodSchema } from '../../schemas/usuario';
import ErrorMessage from '../../components/ErrorMessage';

import { createUsuario } from '../../services/usuarioServices';

const CreateUsuarioPage = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        password: '',
        roles: 'SALES',
        status: 'active'
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resultado = usuarioZodSchema.safeParse(formData);

            if (!resultado.success) {

                const listaErrores = resultado.error.issues.map(issue => ({
                    campo: issue.path[0],
                    mensaje: issue.message
                }));
                setErrors(listaErrores);
            } else {
                await createUsuario(formData);
                navigate('/usuario');
            }

        } catch (error) {
            let serverMessage = "";
            if (error.response) {
                serverMessage = error.response.data.error || 'Error en el servidor';
            } else if (error.request) {
                serverMessage = 'No se pudo conectar con el servidor';
                console.error(serverMessage);
            } else {
                serverMessage = error.message;
                console.error(serverMessage);
            }
            setErrors([{ campo: 'SERVER', mensaje: serverMessage }]);
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    return (
        <div>
            <h1>Crear Nuevo usuario</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Apellido:</label>
                    <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Teléfono:</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Rol:</label>
                    <select name="roles" value={formData.roles} onChange={handleChange}>
                        <option value="SALES">Ventas</option>
                        <option value="INVENTORY">Inventario</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                </div>

                <div>
                    <label>Estado:</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                    </select>
                </div>
                <button type="submit">Crear Usuario</button>
                <button type="button" onClick={() => navigate('/usuario')}>Cancelar</button>
            </form>
            <ErrorMessage errors={errors} />
        </div>
    );
}
export default CreateUsuarioPage;