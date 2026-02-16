import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RecibosPage = () => {
  const [recibo, setRecibos] = useState([]);
  const navigate = useNavigate();

  const obtenerRecibos = async () => {
    try {
      const res = await axios.get("/api/recibo");
      setRecibos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerRecibos();
  }, []);

  return (
    <div>
      <h2>Lista de Recibos</h2>

      <button onClick={() => navigate("/recibo/crear")}>
        Nuevo Recibo
      </button>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Folio</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recibos.map((recibo) => (
            <tr key={recibo._id}>
              <td>{recibo.folio}</td>
              <td>{new Date(recibo.fecha).toLocaleDateString()}</td>
              <td>${recibo.total}</td>
              <td>{recibo.estado}</td>
              <td>
                <button
                  onClick={() => navigate(`/recibo/${recibo._id}`)}
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecibosPage;
