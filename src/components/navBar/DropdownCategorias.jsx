import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCategoria from "../../hooks/api/useCategoria";

const DropdownCategorias = ({ isScrolled }) => {
  const { getCategoriasPadre, getCategoriasHijo } = useCategoria();
  const [categoriasPadre, setCategoriasPadre] = useState([]);
  const [categoriasAgrupadas, setCategoriasAgrupadas] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Obtener datos
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const padres = await getCategoriasPadre();
        const hijos = await getCategoriasHijo();

        setCategoriasPadre(padres);

        const agrupadas = hijos.reduce((acc, hijo) => {
          const padreId = hijo.id_categoria_padre;
          if (!acc[padreId]) acc[padreId] = [];
          acc[padreId].push(hijo);
          return acc;
        }, {});
        setCategoriasAgrupadas(agrupadas);
      } catch (error) {
        console.error("Error fetching categorias:", error);
      }
    };
    fetchCategorias();
  }, []);

  // Cerrar en desktop al hacer clic fuera
  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // ────────────── MOBILE ──────────────
  if (isMobile) {
    return (
      <div className="w-full">
        <button
          onClick={toggleDropdown}
          className="w-full flex justify-between items-center font-semibold text-gray-800"
        >
          <span
            className="cursor-pointer"
            onClick={() => { navigate("/productos"); setIsOpen(false) }}
          >
            Tienda
          </span>
          <span className="text-xl">{isOpen ? "−" : "+"}</span>
        </button>

        {isOpen && (
          <div className="mt-2 pl-4">
            {categoriasPadre.map((padre) => (
              <div key={padre.id} className="mb-2">
                <p className="font-semibold text-gray-700">{padre.nombre}</p>
                <ul>
                  {categoriasAgrupadas[padre.id]?.map((hijo) => (
                    <li key={hijo.id}>
                      <button
                        onClick={() => { navigate(`/productos/${hijo.id}`); setIsOpen(false) }}
                        className="block py-1 text-gray-800 hover:underline"
                      >
                        {hijo.nombre}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ────────────── DESKTOP ──────────────
  return (
    <div ref={dropdownRef} className="min-w-[120px] flex items-center justify-center m-0 p-0">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 font-semibold hover:text-gray-800 transition w-full"
      >
        Tienda
      </button>

      <div
        className={`absolute left-0 w-screen bg-white shadow-md border-t border-gray-200 z-50 transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
          }
        ${isScrolled ? 'top-16' : 'top-20'
          }`}
      >
        <div className="max-w-6xl mx-auto w-fit px-8 py-6">
          <div className="mb-2">
            <h3
              onClick={() => { navigate("/productos"); setIsOpen(false) }}
              className="text-lg font-semibold cursor-pointer" >Tienda</h3>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {categoriasPadre.map((padre) => (
              <div key={padre.id}>
                <h4 className="font-semibold text-gray-700 mb-1">{padre.nombre}</h4>
                <ul>
                  {categoriasAgrupadas[padre.id]?.map((hijo) => (
                    <li key={hijo.id}>
                      <button
                        onClick={() => { navigate(`/productos/${hijo.id}`); setIsOpen(false) }}
                        className="block py-1 text-gray-800 hover:underline"
                      >
                        {hijo.nombre}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownCategorias;
