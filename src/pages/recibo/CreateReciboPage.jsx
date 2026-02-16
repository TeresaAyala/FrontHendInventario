import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateReciboPage = () => {
  const navigate = useNavigate();

  const [folio, setFolio] = useState("");
  const [usuario, setUsuario] = useState("");
  const [productos, setProductos] = useState([]);

  const agregarProducto = () => {
    setProductos([
      ...productos,
      { producto: "", cantidad: 1, precio: 0 }
    ]);
  };

  const handleProductoChange = (index, field, value) => {
    const nuevos = [...productos];
    nuevos[index][field] = value;
    setProductos(nuevos);
  };

  const guardarRecibo = async () => {
    try {
      await axios.post("/api/recibo", {
        folio,
        usuario,
        productos
      });

      alert("Recibo creado correctamente");
      navigate("/recibo");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Crear Recibo</h2>

      <input
        type="text"
        placeholder="Folio"
        value={folio}
        onChange={(e) => setFolio(e.target.value)}
      />

      <input
        type="text"
        placeholder="Usuario ID"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />

      <h3>Productos</h3>

      {productos.map((item, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Producto ID"
            value={item.producto}
            onChange={(e) =>
              handleProductoChange(index, "producto", e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Cantidad"
            value={item.cantidad}
            onChange={(e) =>
              handleProductoChange(index, "cantidad", e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Precio"
            value={item.precio}
            onChange={(e) =>
              handleProductoChange(index, "precio", e.target.value)
            }
          />
        </div>
      ))}

      <button onClick={agregarProducto}>Agregar Producto</button>
      <br /><br />
      <button onClick={guardarRecibo}>Guardar</button>
    </div>
  );
};

export default CreateReciboPage;
