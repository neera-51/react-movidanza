import { useEffect, useState } from "react"
import { MapPin, Phone, Mail, Clock, Calendar, CalendarDays } from "lucide-react"
import { FaTiktok, FaInstagram, FaFacebook } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { capitalize } from "../utils/textUtils"
import useDiaFestivo from "../hooks/api/useDiaFestivo"
import usePeriodoFestivo from "../hooks/api/usePeriodoFestivo"


export default function ContactPage() {

    const { getAllDiasFestivos } = useDiaFestivo()
    const { getAllPeriodosFestivos } = usePeriodoFestivo()


    const [diasFestivos, setDiasFestivos] = useState([])
    const [periodosFestivos, setPeriodosFestivos] = useState([])
    const [error, setError] = useState(null)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [diasData, periodosData] = await Promise.all([
                    getAllDiasFestivos(),
                    getAllPeriodosFestivos(),
                ])
                setDiasFestivos(diasData)
                setPeriodosFestivos(periodosData)
            } catch (err) {
                setError("No se pudo cargar la información.")
            }
        }
        fetchData()
    }, [])

    if (error)
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
                <p className="text-red-600 text-center text-lg">{error}</p>
            </div>
        )


    return (
        <div className="min-h-screen bg-white/30 pt-20">
            <div className="container mx-auto px-4 py-5 max-w-4xl">
                {/* Título */}
                <h1 className="text-4xl font-bold text-center mb-16" style={{ color: "#7912B0" }}>
                    Contacto
                </h1>

                {/* Información de contacto */}
                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div className="space-y-8">
                        {/* Dirección */}
                        <div className="flex items-start space-x-4">
                            <div className="p-3 rounded-full" style={{ backgroundColor: "#7912B0" }}>
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Dirección</h3>
                                <p className="text-gray-600">
                                    C/ En un lugar de la mancha, 33
                                    <br />
                                    28981, Parla, Madrid
                                </p>
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div className="flex items-start space-x-4">
                            <div className="p-3 rounded-full" style={{ backgroundColor: "#7912B0" }}>
                                <Phone className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Teléfono</h3>
                                <p className="text-gray-600">+34 XXX XXX XXX</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Email */}
                        <div className="flex items-start space-x-4">
                            <div className="p-3 rounded-full" style={{ backgroundColor: "#7912B0" }}>
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
                                <p className="text-gray-600">info@movidanza.com</p>
                            </div>
                        </div>

                        {/* Horarios */}
                        <div className="flex items-start space-x-4">
                            <div className="p-3 rounded-full" style={{ backgroundColor: "#7912B0" }}>
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Horarios</h3>
                                <div className="text-gray-600 space-y-1">
                                    <p>
                                        <span className="font-medium">Lunes - Viernes:</span> 10:00 - 13:30 | 16:30 - 21:00
                                    </p>
                                    <p>
                                        <span className="font-medium">Sábados:</span> 10:00 - 14:00
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bloque decorativo */}

                {/* Mapa real */}
                <div className="rounded-lg overflow-hidden border h-[400px] my-10">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d97463.74436532288!2d-3.843697547226853!3d40.237038053631515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd41f5320b893765%3A0xfd153cb3a00bc9bc!2sIES%20Enrique%20Tierno%20Galv%C3%A1n!5e0!3m2!1ses!2ses!4v1748276940318!5m2!1ses!2ses"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>


                {/* Redes Sociales */}
                <div className="text-center mb-5">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Síguenos</h3>
                    <div className="flex justify-center space-x-6">
                        {/* TikTok */}
                        <a
                            href="https://tiktok.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full border-2 hover:bg-[#7912B0]/20 transition-colors"
                            style={{ borderColor: "#7912B0" }}
                        >
                            <FaTiktok className="w-6 h-6 text-[#7912B0]" />
                        </a>

                        {/* Instagram */}
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full border-2 hover:bg-[#7912B0]/20 transition-colors"
                            style={{ borderColor: "#7912B0" }}
                        >
                            <FaInstagram className="w-6 h-6 text-[#7912B0]" />
                        </a>

                        {/* X (antes Twitter) */}
                        <a
                            href="https://x.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full border-2 hover:bg-[#7912B0]/20 transition-colors"
                            style={{ borderColor: "#7912B0" }}
                        >
                            <SiX className="w-6 h-6 text-[#7912B0]" />
                        </a>

                        {/* Facebook */}
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full border-2 hover:bg-[#7912B0]/20 transition-colors"
                            style={{ borderColor: "#7912B0" }}
                        >
                            <FaFacebook className="w-6 h-6 text-[#7912B0]" />
                        </a>
                    </div>
                </div>

                <h2 className="text-4xl font-bold text-center mb-16 mt-10" style={{ color: "#7912B0" }}>
                    Calendario
                </h2>
                {/* Información de Días Festivos y Períodos */}
                <div className="mt-16 grid md:grid-cols-2 gap-12 max-w-6xl mx-auto pb-15">
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
                                        - {capitalize(dia.motivo)}
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
                                        ({capitalize(periodo.motivo)})
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