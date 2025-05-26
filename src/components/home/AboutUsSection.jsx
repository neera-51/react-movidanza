import React from "react";

import {
    ChevronRight,
    Star,
    Users,
    Heart,
    Award,
    Clock,
    Sparkles,
    Target,
    Lightbulb,
} from "lucide-react"

export default function AboutUsSection() {
    return (


        <section id="quienes-somos" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-start gap-12">
                    <div className="md:w-1/2">
                        <div className="inline-block px-4 py-1 bg-purple-100 rounded-full text-morado font-medium mb-4">
                            Quiénes Somos
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                            Pasión por el movimiento y la expresión artística
                        </h2>
                        <p className="text-gray-800 mb-6 leading-relaxed">
                            En <span className="text-morado font-semibold">Movidanza</span>, desde 2015, ofrecemos un espacio dedicado a la danza y el movimiento, con una amplia variedad de disciplinas y estilos. Nuestra misión es que cada estudiante explore formas únicas de expresión a través del movimiento, fomentando el crecimiento personal y colectivo.
                        </p>
                        <p className="text-gray-800 mb-8 leading-relaxed">
                            Contamos con clases innovadoras que invitan a conectar con el cuerpo y la creatividad, ayudando a desarrollar confianza, coordinación y bienestar físico y emocional en cada alumno.
                        </p>


                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                                    <Users className="h-6 w-6 text-morado" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">+200</h3>
                                    <p className="text-sm text-gray-600">Estudiantes</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                                    <Star className="h-6 w-6 text-morado" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">+10</h3>
                                    <p className="text-sm text-gray-600">Años de experiencia</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                                    <Award className="h-6 w-6 text-morado" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">+5</h3>
                                    <p className="text-sm text-gray-600">Premios recibidos</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                                    <Clock className="h-6 w-6 text-morado" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">+30</h3>
                                    <p className="text-sm text-gray-600">Clases semanales</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2">
                        <div className="bg-purple-50 rounded-xl p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <Heart className="h-6 w-6 text-morado mr-2" />
                                Nuestros valores
                            </h3>
                            <div className="grid gap-6">
                                <div className="flex">
                                    <div className="h-10 w-10 rounded-full bg-[#7912B0]/10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                                        <Sparkles className="h-5 w-5 text-morado" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-1">Creatividad</h4>
                                        <p className="text-gray-700">
                                            Fomentamos la expresión creativa y la exploración de nuevas formas de movimiento, permitiendo a
                                            cada estudiante desarrollar su propio estilo.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="h-10 w-10 rounded-full bg-[#7912B0]/10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                                        <Target className="h-5 w-5 text-morado" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-1">Disciplina</h4>
                                        <p className="text-gray-700">
                                            Creemos en el poder de la práctica constante y la dedicación como camino hacia la excelencia en
                                            cualquier estilo de danza.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="h-10 w-10 rounded-full bg-[#7912B0]/10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                                        <Users className="h-5 w-5 text-morado" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-1">Comunidad</h4>
                                        <p className="text-gray-700">
                                            Construimos un espacio inclusivo donde todos son bienvenidos, creando conexiones significativas
                                            a través del arte del movimiento.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="h-10 w-10 rounded-full bg-[#7912B0]/10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                                        <Lightbulb className="h-5 w-5 text-morado" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-1">Innovación</h4>
                                        <p className="text-gray-700">
                                            Nos mantenemos a la vanguardia de las tendencias en danza, incorporando nuevas técnicas y
                                            estilos a nuestro programa educativo.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>

    )
}


