import {
    ArrowRight,
    ChevronRight,
    Music,
    Star,
    Users,
    Video,
    Heart,
    Award,
    Clock,
    Sparkles,
    Target,
    Lightbulb,
    X,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function TestimonialsSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-1 bg-purple-100 rounded-full text-morado font-medium mb-4">
                        Testimonios
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Lo que dicen nuestros alumnos</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Testimonial 1 */}
                    <div className="bg-purple-50 p-6 rounded-xl relative">
                        <p className="text-gray-800 mb-6 pt-4">
                            Movidanza cambió mi vida. Nunca pensé que podría bailar así. Los profesores son increíbles y el ambiente
                            es muy acogedor.
                        </p>
                        <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-purple-200 mr-4 overflow-hidden">
                                <img src="/placeholder.svg" alt="Foto de perfil" className="w-10 h-10 mt-1 ml-0.5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">María García</h4>
                                <p className="text-sm text-gray-600">Estudiante de Ballet</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="bg-purple-50 p-6 rounded-xl relative">
                        <p className="text-gray-800 mb-6 pt-4">
                            Mi hija ha ganado mucha confianza desde que empezó en en esta academia. Los profesores saben cómo motivar a los
                            niños.
                        </p>
                        <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-purple-200 mr-4 overflow-hidden">
                                <img src="/placeholder.svg" alt="Foto de perfil" className="w-10 h-10 mt-1 ml-0.5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">Carlos Rodríguez</h4>
                                <p className="text-sm text-gray-600">Padre de alumna</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="bg-purple-50 p-6 rounded-xl relative">
                        <p className="text-gray-800 mb-6 pt-4">
                            Las clases de bailes urbanos son geniales. He aprendido mucho y he conocido a personas increíbles.
                            ¡Totalmente recomendado!
                        </p>
                        <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-purple-200 mr-4 overflow-hidden">
                                <img src="/placeholder.svg" alt="Foto de perfil" className="w-10 h-10 mt-1 ml-0.5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">Laura Martínez</h4>
                                <p className="text-sm text-gray-600">Estudiante de Urbano</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

