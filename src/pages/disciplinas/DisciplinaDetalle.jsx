"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useDisciplina from "../../hooks/api/useDisciplina"
import { Clock, Euro, Info } from "lucide-react"
import { capitalize } from "../../utils/textUtils"

const DisciplinaDetalle = () => {
    const { id } = useParams()
    const { getDisciplinaById } = useDisciplina()

    const [disciplina, setDisciplina] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const disciplinaData = await getDisciplinaById(id);
                setDisciplina(disciplinaData);
            } catch (err) {
                setError("No se pudo cargar la información.");
            }
        };
        fetchData();
    }, [id]);


    // Formatear los horarios para que se muestren horas y min
    const formatTime = (timeString) => {
        const [hour, minute] = timeString.split(":");
        return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    };


    if (error)
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
                <p className="text-red-600 text-center text-lg">{error}</p>
            </div>
        )

    if (!disciplina)
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
                <p className="text-center text-gray-500 text-lg">Cargando...</p>
            </div>
        )


    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            <div className="container mx-auto px-4 pt-42 pb-16">


                <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
                    {/* Columna izquierda - Imagen */}
                    <div className="max-w-[600px] max-h-[400px] overflow-hidden rounded-2xl bg-gradient-to-t from-[#7912B0]/50 to-transparent">
                        <img
                            src={disciplina.img || "/placeholder.svg?height=400&width=600"}
                            alt={disciplina.nombre}
                            className="w-full h-full object-contain rounded-2xl"
                        />
                    </div>

                    {/* Columna derecha - Detalles */}
                    <div className="space-y-12">

                        {/* Header con título */}
                        <div className="text-leftr mb-12">
                            <h1 className="text-4xl font-bold text-morado mb-4">{disciplina.nombre}</h1>
                        </div>
                        {/* Descripción */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Info className="h-6 w-6 text-morado" />
                                <h2 className="text-2xl font-bold text-morado">Descripción</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                {disciplina.descripcion || "Sin descripción disponible."}
                            </p>
                        </div>

                        {/* Precios */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Euro className="h-6 w-6 text-morado" />
                                <h2 className="text-2xl font-bold text-morado">Precios</h2>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-purple-200 rounded-lg p-4 flex-1 text-center">
                                    <p className="text-gray-600 text-sm font-medium mb-2">Clase suelta</p>
                                    <p className="text-4xl font-bold text-morado">{disciplina.precio_dia}€</p>
                                </div>
                                <div className="bg-purple-200 rounded-lg p-4 flex-1 text-center">
                                    <p className="text-gray-600 text-sm font-medium mb-2">Mensualidad</p>
                                    <p className="text-4xl font-bold text-morado">{disciplina.precio_mes}€</p>
                                </div>
                            </div>
                        </div>

                        {/* Requisitos - Solo si existen en la BD */}
                        {disciplina.requisitos && (
                            <div>
                                <h2 className="text-2xl font-bold text-morado mb-6">Requisitos</h2>
                                <p className="text-gray-700 leading-relaxed text-lg">{disciplina.requisitos}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Horarios - Sección completa ancho */}
                <div className="mt-16">
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <Clock className="h-6 w-6 text-morado" />
                        <h2 className="text-2xl font-bold text-morado">Horarios y Profesores</h2>
                    </div>

                    {disciplina.horarioDisciplinas.length > 0 ? (
                        <div className="max-w-4xl mx-auto">
                            <div className="overflow-hidden rounded-lg border-1 border-[#7912B0]">
                                <table className="w-full">
                                    <thead className="bg-purple-200">
                                        <tr>
                                            <th className="text-left py-4 px-6 text-morado font-semibold text-lg">Día</th>
                                            <th className="text-left py-4 px-6 text-morado font-semibold text-lg">Horario</th>
                                            <th className="text-left py-4 px-6 text-morado font-semibold text-lg">Profesor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {disciplina.horarioDisciplinas.map((slot, index) => (
                                            <tr
                                                key={index}
                                                className={`${index % 2 === 0 ? "bg-purple-50" : "bg-white"}  transition-colors`}
                                            >
                                                <td className="py-4 px-6 text-gray-800 font-medium text-lg">{capitalize(slot.horario.dia_semana)}</td>
                                                <td className="py-4 px-6 text-gray-700 text-lg">
                                                    {formatTime(slot.horario.hora_inicio)} - {formatTime(slot.horario.hora_fin)}
                                                </td>
                                                <td className="py-4 px-6 text-gray-800 font-medium text-lg">
                                                    {capitalize(slot.profesor.nombre)} {capitalize(slot.profesor.apellidos)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic text-center text-lg">No hay horarios disponibles.</p>
                    )}
                </div>


            </div>
        </div>
    )
}

export default DisciplinaDetalle
