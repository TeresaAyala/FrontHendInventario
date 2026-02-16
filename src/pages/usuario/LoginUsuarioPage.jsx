import { useState, useEffect } from 'react';
import { loginUsuario } from '../../services/usuarioServices';
import ErrorMessage from '../../components/ErrorMessage';
import { loginSchema } from '../../schemas/usuario';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }, []);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const resultado = loginSchema.safeParse(credentials);
            if (!resultado.success) {
                setErrors(resultado.error.issues.map(issue => ({ campo: issue.path[0], mensaje: issue.message })));
            } else {
                const response = await loginUsuario(credentials);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
                navigate('/');
            }
        } catch (error) {
            setErrors([{ campo: 'SERVER', mensaje: error.response?.data.msg || 'Error de conexión' }]);
        }
        setIsLoading(false);
    };

    const styles = {
        // Este contenedor ahora fuerza el "encima de todo"
        fullPage: {
            position: 'fixed', // Se posiciona respecto a la ventana, no al div padre
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999, // Se pone por encima del menú lateral
            fontFamily: 'sans-serif'
        },
        card: {
            backgroundColor: 'white',
            padding: '40px 30px',
            borderRadius: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            width: '90%',
            maxWidth: '400px',
            textAlign: 'center'
        },
        circle: {
            backgroundColor: '#3b82f6',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '30px'
        },
        input: {
            width: '100%',
            padding: '12px',
            margin: '8px 0 20px',
            border: '1px solid #d1d5db',
            borderRadius: '10px',
            boxSizing: 'border-box',
            fontSize: '16px' // Evita zoom en iPhone
        },
        button: {
            width: '100%',
            padding: '14px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px'
        }
    };

    return (
        <div style={styles.fullPage}>
            <div style={styles.card}>
                <div style={{fontSize: '12px', fontWeight: 'bold', marginBottom: '10px'}}>🔒 ACCESO INTERNO</div>
                <div style={styles.circle}>💼</div>
                <h2 style={{margin: '0 0 5px'}}>Login de Empleado</h2>
                <p style={{color: '#6b7280', marginBottom: '25px'}}>Gestión de Inventario</p>
                
                <form onSubmit={handleSubmit} style={{textAlign: 'left'}}>
                    <label style={{fontWeight: '600', fontSize: '14px'}}>Correo Electrónico</label>
                    <input 
                        name="email" 
                        type="email" 
                        style={styles.input} 
                        onChange={handleChange} 
                        placeholder="ejemplo@correo.com"
                        required 
                    />

                    <label style={{fontWeight: '600', fontSize: '14px'}}>Contraseña</label>
                    <input 
                        name="password" 
                        type="password" 
                        style={styles.input} 
                        onChange={handleChange} 
                        placeholder="••••••••"
                        required 
                    />

                    <button type="submit" style={styles.button} disabled={isLoading}>
                        {isLoading ? 'Cargando...' : 'Entrar →'}
                    </button>
                </form>
                <ErrorMessage errors={errors} />
            </div>
        </div>
    );
};

export default LoginPage;