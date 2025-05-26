import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useDisciplina from "../../hooks/useDisciplina";
import DisciplinaCard from "../DisciplinaCard";

export default function ClassesSection() {
  const { getAllDisciplinas } = useDisciplina();
  const [disciplinas, setDisciplinas] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todas = await getAllDisciplinas();
        setDisciplinas(todas);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="que-ofrecemos" className="py-20 bg-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-purple-100 rounded-full text-morado font-medium mb-4">
            Qué Ofrecemos
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Nuestras disciplinas</h2>
          <p className="text-gray-800 max-w-2xl mx-auto">
            Encuentra la manera de bailar que más se conecta contigo, sin importar tu experiencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {disciplinas.slice(0, 3).map((disciplina) => (
            <DisciplinaCard key={disciplina.id} disciplina={disciplina} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/disciplinas")}
            className="px-6 py-3 bg-morado text-white rounded-full font-medium inline-flex items-center justify-center hover:bg-[#6a0f9d] transition-colors"
          >
            Ver todas las disciplinas
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
