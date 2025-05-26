// components/DisciplinaCard.jsx
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function DisciplinaCard({ disciplina }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-purple-200 relative">
        <div className="flex justify-center items-center h-full">
          <img
            src={disciplina.img ? disciplina.img : "/placeholder.svg"}
            alt={disciplina.nombre}
            className={
              disciplina.img
                ? "w-full h-full object-contain"
                : "w-20 h-20 object-contain mt-1"
            }
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#7912B0]/50 to-transparent flex items-end">
          <div className="p-4">
            <span className="px-2 py-1 bg-white text-morado rounded-full text-xs font-medium">
              &#9834;
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{disciplina.nombre}</h3>
        <p className="text-gray-800 mb-4 line-clamp-1"> {/** line-clamp me permite limitar los párrafos */}
          {disciplina.descripcion || "\u00A0" }
        </p>

        <button
          onClick={() => {navigate(`/disciplina/${disciplina.id}`)}}
          className="inline-flex items-center text-morado font-medium hover:underline underline-offset-5"
        >
          Más información
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
