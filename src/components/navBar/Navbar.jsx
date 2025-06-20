import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart } from "lucide-react"
import logo from '../../assets/noBgColor.png';
import ProfileButton from './ProfileButton';
import DropdownDisciplinas from './DropdownDisciplinas';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const hamburgerButtonRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;


  // Cierra el menú móvil si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerButtonRef.current &&
        !hamburgerButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Cierra el menú móvil si cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Detecta scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`navbar fixed top-0 w-full flex items-center justify-between px-6 transition-all duration-300 z-50 ${isScrolled ? 'bg-white shadow-md h-16' : 'bg-white/30 h-20'
        }`}
    >
      {/* Logo */}
      <div className="flex-shrink-0 min-w-[140px] flex justify-center">
        <button
          onClick={() => { navigate("/") }}>
          <img src={logo} alt="Logo" className="h-11 mx-auto" />
        </button>
      </div>

      {/* Menú principal - visible solo en desktop */}
      <div className="hidden md:flex justify-center space-x-6 flex-grow">
        <DropdownDisciplinas isScrolled={isScrolled} />
        <button
          className={` mr-0 px-4 py-2 font-semibold ${currentPath === "/productos" ? " underline underline-offset-7" : ""}`}
          onClick={() => navigate("/productos")}
        >
          Tienda
        </button>

        <button
          onClick={() => { navigate("/contacto") }}
          className={` px-4 py-2 font-semibold ${currentPath === "/contacto" ? " underline underline-offset-7" : ""}`}
        >
          Contacto
        </button>
      </div>

      {/* Botón Hamburguesa - visible solo en mobile */}
      <div className="md:hidden" ref={hamburgerButtonRef}>
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Abrir o cerrar menú"
        >
          <div className="space-y-1">
            <div className="w-6 h-0.5 bg-black"></div>
            <div className="w-6 h-0.5 bg-black"></div>
            <div className="w-6 h-0.5 bg-black"></div>
          </div>
        </button>
      </div>

      {/* Perfil (desktop) */}
      <div className="flex-shrink-0 min-w-[140px] hidden md:flex justify-center gap-2">
        <button
          onClick={() => navigate("/carrito")}
          className="flex items-center space-x-2 hover:bg-[#7912B0]/10 px-3 py-2 rounded-xl transition-colors"
        >
          <ShoppingCart className="h-6 w-6 text-[#7912B0]" />
        </button>
        <ProfileButton />
      </div>

      {/* Menú lateral (mobile) */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-6 z-50 transition-all ease-in-out duration-300 flex flex-col justify-start"
        >
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Cerrar menú"
            className="self-end text-2xl mb-6"
          >
            ✕
          </button>

          <div className="flex flex-col items-start gap-6 text-base text-gray-900">
            <DropdownDisciplinas isMobile />
            <button
              className="font-semibold hover:underline underline-offset-5"
              onClick={() => { navigate("/productos"); setIsMobileMenuOpen(false) }}
            >
              Tienda
            </button>
            <button
              onClick={() => { navigate("/contacto"); setIsMobileMenuOpen(false) }}
              className="font-semibold hover:underline underline-offset-5"
            >
              Contacto
            </button>

            <button
              onClick={() => { navigate("/carrito"); setIsMobileMenuOpen(false); }}
              className="flex items-center space-x-2 py-2 rounded-xl transition-colors"
            >
              <span className="font-semibold hover:underline underline-offset-5">Carrito</span>
              <ShoppingCart className="h-6 w-6 text-[#7912B0]" />

            </button>


            <div className="w-full flex justify-start">
              <div className="h-px w-2/3 bg-gray-300 my-2" />
            </div>

            <ProfileButton />
          </div>
        </div>
      )}
    </nav>
  );
}
