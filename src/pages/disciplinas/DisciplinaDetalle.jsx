"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useDisciplina from "../../hooks/api/useDisciplina"
import useDiaFestivo from "../../hooks/api/useDiaFestivo"
import usePeriodoFestivo from "../../hooks/api/usePeriodoFestivo"
import { Clock, Euro, Info, Calendar, CalendarDays } from "lucide-react"

const DisciplinaDetalle = () => {
    const { id } = useParams()
    const { getDisciplinaById } = useDisciplina()
    const { getAllDiasFestivos } = useDiaFestivo()
    const { getAllPeriodosFestivos } = usePeriodoFestivo()
    const [disciplina, setDisciplina] = useState(null)
    const [diasFestivos, setDiasFestivos] = useState([])
    const [periodosFestivos, setPeriodosFestivos] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [disciplinaData, diasData, periodosData] = await Promise.all([
                    getDisciplinaById(id),
                    getAllDiasFestivos(),
                    getAllPeriodosFestivos(),
                ])
                setDisciplina(disciplinaData)
                setDiasFestivos(diasData)
                setPeriodosFestivos(periodosData)
            } catch (err) {
                setError("No se pudo cargar la información.")
            }
        }
        fetchData()
    }, [id])

    // Poner la primera en mayúscula
    const capitalize = (str) =>
        str
            ?.toLowerCase()
            .split(" ")
            .filter(Boolean) // elimina espacios dobles
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

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
            <div className="container mx-auto px-4 pt-32 pb-16">


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

                {/* Información de Días Festivos y Períodos */}
                <div className="mt-16 grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Días Festivos */}
                    <div>
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Calendar className="h-6 w-6 text-morado" />
                            <h2 className="text-2xl font-bold text-morado text-center">Días Festivos</h2>
                        </div>
                        {diasFestivos.length > 0 ? (
                            <ul className="space-y-2">
                                {diasFestivos.map((dia, index) => (
                                    <li key={index} className="flex items-center text-gray-700 text-lg">
                                        <span className="w-2 h-2 bg-morado rounded-full mr-3"></span>
                                        {new Date(dia.fecha).toLocaleDateString("es-ES", {
                                            day: "numeric",
                                            month: "long",
                                        })}{" "}
                                        - {capitalize(dia.nombre)}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic text-lg">No hay días festivos registrados.</p>
                        )}
                    </div>

                    {/* Períodos Festivos */}
                    <div>
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <CalendarDays className="h-6 w-6 text-morado" />
                            <h2 className="text-2xl font-bold text-morado">Períodos Festivos</h2>
                        </div>
                        {periodosFestivos.length > 0 ? (
                            <ul className="space-y-2">
                                {periodosFestivos.map((periodo, index) => (
                                    <li key={index} className="flex items-center text-gray-700 text-lg">
                                        <span className="w-2 h-2 bg-morado rounded-full mr-3"></span>
                                        {new Date(periodo.fecha_inicio).toLocaleDateString("es-ES", {
                                            day: "numeric",
                                            month: "long",
                                        })}{" "}
                                        -{" "}
                                        {new Date(periodo.fecha_fin).toLocaleDateString("es-ES", {
                                            day: "numeric",
                                            month: "long",
                                        })}{" "}
                                        ({capitalize(periodo.nombre)})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic text-lg">No hay períodos festivos registrados.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisciplinaDetalle
