import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { FaTiktok, FaInstagram, FaFacebook } from "react-icons/fa";
import { SiX } from "react-icons/si";


export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white pt-20">
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
                            className="p-3 rounded-full border-2 hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "#7912B0" }}
                        >
                            <FaTiktok className="w-6 h-6 text-[#7912B0]" />
                        </a>

                        {/* Instagram */}
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full border-2 hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "#7912B0" }}
                        >
                            <FaInstagram className="w-6 h-6 text-[#7912B0]" />
                        </a>

                        {/* X (antes Twitter) */}
                        <a
                            href="https://x.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full border-2 hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "#7912B0" }}
                        >
                            <SiX className="w-6 h-6 text-[#7912B0]" />
                        </a>

                        {/* Facebook */}
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full border-2 hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "#7912B0" }}
                        >
                            <FaFacebook className="w-6 h-6 text-[#7912B0]" />
                        </a>
                    </div>
                </div>

            </div>
        </div>
    )
}
