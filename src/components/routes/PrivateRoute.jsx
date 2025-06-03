import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../hooks/context/UserContext';

/**
 * PrivateRoute:
 * - Muestra los hijos solo si el usuario está autenticado.
 * - Mientras se verifica el usuario (checking=true), no muestra nada.
 * - Si no hay usuario, redirige a login.
 */
export default function PrivateRoute({ children }) {
  const { user, checking } = useUser();

  if (checking) {
    // Opcional: podría mostrar un loader aquí
    return null;
  }

  if (!user) {
    // No autenticado: redirige a login
    return <Navigate to="/login" replace />;
  }

  // Usuario autenticado: renderiza contenido protegido
  return children;
}
