import React, { useState, useEffect } from "react";
import useDisciplina from "../../hooks/api/useDisciplina";
import DisciplinaCard from "../../components/DisciplinaCard";

export default function LayoutDisciplinas() {
  const { getAllDisciplinas } = useDisciplina();
  const [disciplinas, setDisciplinas] = useState([]);
  const [error, setError] = useState(null);

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
    <section id="layout-disciplinas" className="pt-32 container mx-auto px-4">
      {error && (
        <div className="text-red-500 text-center mb-4">
          Ocurrió un error al cargar las disciplinas.
        </div>
      )}

      {disciplinas.length === 0 && !error ? (
        <div className="text-center text-gray-600">Cargando disciplinas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {disciplinas.map((disciplina) => (
            <DisciplinaCard key={disciplina.id} disciplina={disciplina} />
          ))}
        </div>
      )}
    </section>
  );
}
