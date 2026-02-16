import { useEffect, useState } from "react";
import { getRoles, deleteRoles } from "../../services/rolesServices";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);

  const loadRoles = async () => {
    const { data } = await getRoles();
    setRoles(data);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar rol?")) {
      await deleteRoles(id);
      loadRoles();
    }
  };

  return (
    <div>
      <h2>Roles</h2>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((roles) => (
            <tr key={roles._id}>
              <td>{roles._id}</td>
              <td>{roles.nombre}</td>
              <td>
                <button onClick={() => handleDelete(roles._id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
