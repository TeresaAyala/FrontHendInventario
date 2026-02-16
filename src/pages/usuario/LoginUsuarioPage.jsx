import { useState, useEffect } from 'react';
import { loginUsuario } from '../../services/usuarioServices';
import ErrorMessage from '../../components/ErrorMessage';
import { loginSchema } from '../../schemas/usuario';
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }, []);
    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const resultado = loginSchema.safeParse(credentials);
            if (!resultado.success) {
                const listaErrores = resultado.error.issues.map(issue => ({
                    campo: issue.path[0],
                    mensaje: issue.message
                }));
                setErrors(listaErrores);
            }
            else {
                const response = await loginUsuario(credentials);
                localStorage.setItem('token', response.data.token);
                const usuarioInfo=JSON.stringify(response.data.usuario);
                localStorage.setItem('usuario',usuarioInfo);
                navigate('/');
            }

        } catch (error) {
            let serverMessage = "";
            if (error.response) {
                serverMessage = error.response.data.msg || 'Error en el servidor';
            } else if (error.request) {
                serverMessage = 'No se pudo conectar con el servidor';
            } else {
                serverMessage = error.message;
                console.error(serverMessage);
            }
            setErrors([{ campo: 'SERVER', mensaje: serverMessage }]);

        }
        setIsLoading(false);
    };

    return (
        <section>
            <div>
                <h2>Iniciar Sesión</h2>
                <p>Introduce tus credenciales</p>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="tu@correo.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="********"
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Cargando...' : 'Entrar'}
                    </button>
                </form>
                <ErrorMessage errors={errors} />
            </div>
        </section>
    );
};

export default LoginPage;