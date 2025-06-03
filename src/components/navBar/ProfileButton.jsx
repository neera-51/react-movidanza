import { useNavigate } from 'react-router-dom';
import RippleButton from '../ui/RippleButton';
import { useUser } from '../../hooks/context/UserContext';

/**
 * Componente ProfileButton
 * Botón que redirige según el estado de autenticación del usuario:
 *  - Si no está autenticado, redirige a la página de inicio de sesión
 *  - Si está autenticado, redirige al perfil del usuario (pendiente de implementación)
 */
export default function ProfileButton({ className, ...props }) {
  const navigate = useNavigate();
  const { user, checking } = useUser();

  const handleClick = () => {
    if (checking) return; // Si aún se está verificando la sesión, no hacer nada
    if (user) {
      console.log('Usuario autenticado con ID:', user.id);
      // Si el usuario está autenticado: redirigir al perfil del usuario
      navigate('/userProfile', { replace: true }); // Fuerzo la recarga
    } else {
      console.log('Usuario', user);
      // Si el usuario no está autenticado: redirigir al login
      navigate('/login');
    }
  };

  // Mientras se verifica el estado de autenticación, se puede mostrar un espacio vacío o un indicador de carga
  if (checking) return null;

  return (
    <div className="inline-block text-left relative" {...props}>
      <RippleButton
        variant="purple"
        onClick={handleClick}
        disabled={checking} // Desactivar el botón mientras se verifica para evitar clics accidentales
        className={`${className || ''} py-2 px-4 transition duration-300 ease-in-out`}
      >
        Mi perfil
      </RippleButton>
    </div>
  );
}
