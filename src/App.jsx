import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";

/* AUTH */
import LoginUsuarioPage from "./pages/usuario/LoginUsuarioPage";

/* USUARIOS */
import UsuarioPage from "./pages/usuario/UsuarioPage";
import CreateUsuarioPage from "./pages/usuario/CreateUsuarioPage";
import EditUsuarioPage from "./pages/usuario/EditUsuarioPage";
import ChangePasswordUsuarioPage from "./pages/usuario/ChangePasswordUsuarioPage";

/* PRODUCTOS */
import ProductoPage from "./pages/producto/ProductoPage";
import CreateProductoPage from "./pages/producto/CreateProductoPage";
import EditProductoPage from "./pages/producto/EditProductoPage";

/* CATEGORIAS */
import CategoriasPage from "./pages/categoria/CategoriasPage";
import CreateCategoriaPage from "./pages/categoria/CreateCategoriaPage";
import EditCategoriaPage from "./pages/categoria/EditCategoriaPage";

/* CATALOGO */
import CatalogosPage from "./pages/catalogo/CatalogosPage";
import CreateCatalogoPage from "./pages/catalogo/CreateCatalogoPage";

/* PROVEEDORES */
import ProveedoresPage from "./pages/Proveedores/ProveedoresPage";
import CreateProveedorPage from "./pages/Proveedores/CreateProveedorPage";
import EditProveedorPage from "./pages/Proveedores/EditProveedorPage";

/* MOVIMIENTOS INVENTARIO */
import MovimientosInventarioPage from "./pages/movimientosInventario/MovimientosInventarioPage";

/* RECIBOS */
import RecibosPage from "./pages/recibo/RecibosPage";
import CreateReciboPage from "./pages/recibo/CreateReciboPage";
import ReciboDetallePage from "./pages/recibo/ReciboDetallePage";

/* ROLES */
import RolesPage from "./pages/roles/RolesPage";
import CreateRolesPage from "./pages/roles/CreateRolesPage";
import EditRolesPage from "./pages/roles/EditRolesPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>

          /* PUBLIC */
          <Route index element={<Home />} />
          <Route path="usuario/login" element={<LoginUsuarioPage />} />

          /* ===== RUTAS GENERALES (ADMIN / INVENTORY / SALES) ===== */
          <Route
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "INVENTORY", "SALES"]} />
            }
          >
            <Route path="producto" element={<ProductoPage />} />
            <Route path="recibo" element={<RecibosPage />} />
            <Route path="recibo/:id" element={<ReciboDetallePage />} />
            <Route path="usuario/changepassword" element={<ChangePasswordUsuarioPage />} />
          </Route>

          /* ===== INVENTARIO Y ADMIN ===== */
          <Route
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "INVENTORY"]} />
            }
          >
            <Route path="producto/create" element={<CreateProductoPage />} />
            <Route path="producto/edit/:id" element={<EditProductoPage />} />

            <Route path="categoria" element={<CategoriasPage />} />
            <Route path="categoria/create" element={<CreateCategoriaPage />} />
            <Route path="categoria/edit/:id" element={<EditCategoriaPage />} />

            <Route path="catalogo" element={<CatalogosPage />} />
            <Route path="catalogo/create" element={<CreateCatalogoPage />} />

            <Route path="proveedores" element={<ProveedoresPage />} />
            <Route path="proveedores/create" element={<CreateProveedorPage />} />
            <Route path="proveedores/edit/:id" element={<EditProveedorPage />} />

            <Route path="movimientosInventario" element={<MovimientosInventarioPage />} />

            <Route path="recibo/create" element={<CreateReciboPage />} />
          </Route>

          /* ===== SOLO ADMIN ===== */
          <Route
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]} />
            }
          >
            <Route path="usuario" element={<UsuarioPage />} />
            <Route path="usuario/create" element={<CreateUsuarioPage />} />
            <Route path="usuario/edit/:id" element={<EditUsuarioPage />} />

            <Route path="roles" element={<RolesPage />} />
            <Route path="roles/create" element={<CreateRolesPage />} />
            <Route path="roles/edit/:id" element={<EditRolesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
