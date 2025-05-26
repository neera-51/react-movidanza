import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import DisciplinaDetalle from '../pages/disciplinas/DisciplinaDetalle';
import AuthPage from '../pages/auth/AuthPage';
import PublicRoute from '../components/routes/PublicRoute';
import PrivateRoute from '../components/routes/PrivateRoute';

import LayoutPerfil from '../pages/perfil/LayoutPerfil';
import Cuenta from '../pages/perfil/Cuenta';
import Direcciones from '../pages/perfil/Direcciones';
import FormularioDireccion from '../pages/perfil/formularios/FormularioDireccion';
import MetodosPago from '../pages/perfil/MetodosPago';
import FormularioMetodoPago from '../pages/perfil/formularios/FormularioMetodoPago';
import Carrito from '../pages/perfil/Carrito';
import Pedidos from '../pages/perfil/PedidosRealizados';

import LayoutDisciplinas from '../pages/disciplinas/LayoutDisciplinas';
import LayoutProductos from '../pages/productos/LayoutProductos';
import ProductoDetalle from '../pages/productos/ProductoDetalle';
import ContactoPage from '../pages/ContactoPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Layout de Discilplinas */}
      <Route path="/disciplinas" element={<LayoutDisciplinas />} />

      {/* Ruta dinámica para disciplina */}
      <Route path="/disciplina/:id" element={<DisciplinaDetalle />} />

      {/* Login y registro solo para no autenticados */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />
      <Route
        path="/registro"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      {/* Rutas de perfil con layout y rutas hijas */}
      <Route
        path="/userProfile"
        element={
          <PrivateRoute>
            <LayoutPerfil />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="cuenta" replace />} />
        <Route path="cuenta" element={<Cuenta />} />

        {/* Rutas de direcciones con subruta para nueva y editar*/}
        <Route path="direcciones" element={<Direcciones />}>
          <Route path="nueva" element={<FormularioDireccion />} />
          <Route path="editar/:id" element={<FormularioDireccion />} />
        </Route>

        {/* Rutas de métodos de pago con subruta para nuevo y editar*/}
        <Route path="metodos_pago" element={<MetodosPago />}>
          <Route path="nueva" element={<FormularioMetodoPago />} />
          <Route path="editar/:id" element={<FormularioMetodoPago />} />
        </Route>

        <Route path="carrito" element={<Carrito />} />
        <Route path="pedidos" element={<Pedidos />} />
      </Route>

      {/* Layout de Productos */}
      <Route path="/productos" element={<LayoutProductos />} />

      {/* Ruta dinámica para producto */}
      <Route path="/productos/:id" element={<ProductoDetalle />} />

      {/* Contacto */}
      <Route path="/contacto" element={<ContactoPage />} />


        {/* Ruta catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
