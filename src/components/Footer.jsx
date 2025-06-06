import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import logo from '../assets/noBgColor.png';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-white/30 text-gray-700 py-8 shadow-[0px_-1px_3px_rgba(0,0,0,0.05)] border-t-1 border-gray-200">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sección Izquierda: Logo y lema */}
        <div>
          <div className="flex-shrink-0 min-w-[140px] flex justify-left">
            <button 
            onClick={() => {navigate("/")}}
            >
              <img src={logo} alt="Logo" className="h-11 mx-auto" />
            </button>
          </div>
          <p className="text-sm mt-2 text-gray-600">- Movimiento en todas sus formas -</p>
        </div>

        {/* Sección Central: Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Contacto</h3>
          <p><strong>Dirección:</strong> C/ En un lugar de la mancha, 33</p>
          <p><strong>Teléfono:</strong> +34 XXX XXX XXX</p>
          <p><strong>Email:</strong> info@movidanza.com</p>
        </div>

        {/* Sección Derecha: Redes Sociales */}
        <div className="text-right">
          <h3 className="text-lg font-semibold text-gray-700">Síguenos</h3>
          <div className="flex justify-end space-x-4 mt-2">
            <a href="https://facebook.com" target="_blank"><FaFacebook className="text-2xl text-gray-700 hover:text-gray-500" /></a>
            <a href="https://tiktok.com" target="_blank"><FaTiktok className="text-2xl text-gray-700 hover:text-gray-500" /></a>
            <a href="https://instagram.com" target="_blank"><FaInstagram className="text-2xl text-gray-700 hover:text-gray-500" /></a>
            <a href="https://x.com" target="_blank"><FaXTwitter className="text-2xl text-gray-700 hover:text-gray-500" /></a>
          </div>
        </div>

      </div>

      {/* Línea separadora suave en gris claro */}
      <div className="my-6">
        <div className="mx-auto w-2/3 border-t border-gray-300" />
      </div>

      <div className="text-center text-sm mt-6 text-gray-600">
        &copy; 2015 - 2025 Movidanza S.L. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
