import { getUsuario } from '../../services/usuarioServices';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UsuarioPage = () => {
    const [usuario, setUsuario] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: ''
    });
    const navigate = useNavigate();
    const fetchUsuario = async () => {
        try {
            setLoading(true);
            const response = await getUsuario(formData);
            setUsuario(response.data);
        } catch (error) {
            console.error('Error fetching Users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuario();
    }, []);

    if (loading) {
        return <div>Cargando usuarios...</div>;
    }
    return (
        <div>
            <form>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={formData.Nombre}
                        onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
                    />
                </div>
                <div>
                    <label>Apellido:</label>
                    <input
                        type="text"
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        required
                    />
                </div>
                <button onClick={fetchUsuario}>Buscar</button>
                <button onClick={() => navigate('/usuario/create')}>Agregar Usuario</button><br />
            </form>
            <h1>Lista de Usuarios</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nombre Completo</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuario.map((usuario) => (
                        <tr key={usuario._id}>
                            <td>{`${usuario.nombre} ${usuario.apellido}`}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.telefono || 'N/A'}</td>
                            <td>
                                <span className={`badge-${usuario.roles.toLowerCase()}`}>
                                    {usuario.roles}
                                </span>
                            </td>
                            <td>
                                {usuario.status === 'active' ? '✅ Activo' : '❌ Inactivo'}
                            </td>
                            <td>
                                <button
                                    className="btn-edit"
                                    onClick={() => navigate(`/usuario/edit/${usuario._id}`)}
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default UsuarioPage;
