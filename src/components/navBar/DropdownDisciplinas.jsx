import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useDisciplina from "../../hooks/api/useDisciplina";

const DropdownDisciplinas = ({ isScrolled }) => {
  const { getAllDisciplinas } = useDisciplina();
  const [disciplinas, setDisciplinas] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Detectar móvil

  const navigate = useNavigate()
  const location = useLocation();
  const currentPath = location.pathname;

  const dropdownRef = useRef(null);

  // Detectar tamaño de pantalla al cargar y al redimensionar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cargar datos
  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const data = await getAllDisciplinas();
        setDisciplinas(data);
      } catch (error) {
        console.error("Error fetching disciplinas:", error);
      }
    };
    fetchDisciplinas();
  }, []);

  // Cerrar dropdown al hacer clic fuera (solo en desktop)
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
            onClick={() => { navigate("/disciplinas"); setIsOpen(false) }}
            className="cursor-pointer !hover:underline"
          >
            Disciplinas
          </span>
          <span className="text-xl">{isOpen ? "−" : "+"}</span>
        </button>

        {isOpen && (
          <div className="mt-2 pl-4">
            <ul>
              {disciplinas.map((disciplina) => (
                <li key={disciplina.id}>
                  <button
                    onClick={() => { navigate(`/disciplina/${disciplina.id}`); setIsOpen(false) }}
                    className="block text-gray-700 py-1 hover:underline"
                  >
                    {disciplina.nombre}
                  </button>
                </li>
              ))}
            </ul>
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
        className={` px-4 py-2 font-semibold hover:text-gray-800 transition flex items-center justify-center w-full ${currentPath === "/disciplinas" ? " underline underline-offset-7" : ""}`}
      >
        Disciplinas
        {isOpen ? <ChevronUp className="ml-2 w-4 h-4" /> : <ChevronDown className="ml-2 w-4 h-4" />}
      </button>

      <div
        className={`absolute left-0  w-screen bg-white shadow-md border-t border-gray-200 z-50 transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
          }
        ${isScrolled ? 'top-16' : 'top-20'
          }`}
      >
        <div className="max-w-6xl mx-auto w-fit px-8 py-6">
          <div className="mb-2">
            <h3
              className="text-lg font-semibold cursor-pointer"
              onClick={() => { navigate("/disciplinas"); setIsOpen(false) }}
            >
              Disciplinas
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[0, 1, 2].map((colIndex) => (
              <div key={colIndex}>
                <ul>
                  {disciplinas
                    .filter((_, index) => index % 3 === colIndex)
                    .map((disciplina) => (
                      <li key={disciplina.id}>
                        <button
                          onClick={() => { navigate(`/disciplina/${disciplina.id}`); setIsOpen(false) }}
                          className="block py-1 text-gray-800 hover:underline"
                        >
                          {disciplina.nombre}
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

export default DropdownDisciplinas;
