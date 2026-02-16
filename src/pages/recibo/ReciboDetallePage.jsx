import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ReciboDetallePage = () => {
  const { id } = useParams();
  const [recibo, setRecibo] = useState(null);
  const [detalles, setDetalles] = useState([]);

  const obtenerRecibo = async () => {
    try {
      const res = await axios.get(`/api/recibo/${id}`);
      setRecibo(res.data.recibo);
      setDetalles(res.data.detalles);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerRecibo();
  }, []);

  const descargarPDF = () => {
    window.open(`/api/recibo/${id}/pdf`, "_blank");
  };

  if (!recibo) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Detalle del Recibo</h2>

      <p><strong>Folio:</strong> {recibo.folio}</p>
      <p><strong>Fecha:</strong> {new Date(recibo.fecha).toLocaleDateString()}</p>
      <p><strong>Total:</strong> ${recibo.total}</p>
      <p><strong>Estado:</strong> {recibo.estado}</p>

      <h3>Productos</h3>

      <ul>
        {detalles.map((d) => (
          <li key={d._id}>
            {d.producto?.nombre} - Cant: {d.cantidad} - $
            {d.subtotal}
          </li>
        ))}
      </ul>

      <button onClick={descargarPDF}>
        Descargar PDF
      </button>
    </div>
  );
};

export default ReciboDetallePage;
