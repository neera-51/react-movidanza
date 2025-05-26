import React from 'react';
import { Navigate } from 'react-router-dom';
import useUser from '../../hooks/useUserAuth';

/**
 * PublicRoute:
 * - Muestra hijos solo si NO hay usuario autenticado.
 * - Mientras se verifica el usuario, no muestra nada.
 * - Si hay usuario, redirige a Home ("/").
 */
export default function PublicRoute({ children }) {
  const { user, checking } = useUser();

  if (checking) {
    // Opcional: loader mientras se verifica sesión
    return null;
  }

  if (user) {
    // Ya autenticado: no puede acceder a login/registro, redirige a home
    return <Navigate to="/" replace />;
  }

  // No autenticado: renderiza contenido público
  return children;
}
