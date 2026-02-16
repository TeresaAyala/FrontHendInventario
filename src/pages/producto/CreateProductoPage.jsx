import { createProducto } from '../../services/productoServices';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoZodSchema } from '../../schemas/producto';
import ErrorMessage from '../../components/ErrorMessage';

const CreateProductoPage = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);

    const [formData, setFormData] = useState({
        nombre: '',
        categoria: '',
        sku: '',
        precio: '',
        cantidad: '',
        imagen: '',
        estadoStock: 'DISPONIBLE'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const resultado = productoZodSchema.safeParse(formData);

        if (!resultado.success) {
            const listaErrores = resultado.error.issues.map(issue => ({
                campo: issue.path[0],
                mensaje: issue.message
            }));
            setErrors(listaErrores);
            return;
        }

        try {
            await createProducto(formData);
            navigate('/producto');
        } catch (error) {
            let serverMessage = "";

            if (error.response) {
                serverMessage = error.response.data.error || 'Error en el servidor';
            } else if (error.request) {
                serverMessage = 'No se pudo conectar con el servidor';
            } else {
                serverMessage = error.message;
            }

            setErrors([{ campo: 'SERVER', mensaje: serverMessage }]);
        }
    };

    return (
        <div>
            <h1>Crear Nuevo Producto</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Categoría:</label>
                    <input
                        type="text"
                        value={formData.categoria}
                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>SKU:</label>
                    <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Precio:</label>
                    <input
                        type="number"
                        value={formData.precio}
                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Cantidad:</label>
                    <input
                        type="number"
                        value={formData.cantidad}
                        onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Imagen (URL):</label>
                    <input
                        type="text"
                        value={formData.imagen}
                        onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                    />
                </div>

                <div>
                    <label>Estado:</label>
                    <select
                        value={formData.estadoStock}
                        onChange={(e) => setFormData({ ...formData, estadoStock: e.target.value })}
                    >
                        <option value="DISPONIBLE">DISPONIBLE</option>
                        <option value="AGOTADO">AGOTADO</option>
                    </select>
                </div>

                <button type="submit">Crear Producto</button>
                <button type="button" onClick={() => navigate('/producto')}>
                    Cancelar
                </button>

            </form>

            <ErrorMessage errors={errors} />
        </div>
    );
};

export default CreateProductoPage;
