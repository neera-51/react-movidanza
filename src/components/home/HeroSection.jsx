import React from "react";
import { ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate();
    return (
        <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-purple-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold text-morado mb-6 leading-tight animate-fadeIn">
                        Movidanza
                    </h1>
                    <p className="italic text-xl md:text-2xl !text-grey-900 mb-10 tracking-wide animate-fadeIn animation-delay-200">
                        Movimiento que inspira
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn animation-delay-400">
                        <a
                            href="#que-ofrecemos"
                            className="px-6 py-3 bg-morado text-white rounded-full font-medium flex items-center justify-center hover:bg-[#6a0f9d] transition-colors"
                        >
                            Nuestras clases
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </a>
                        <button
                            onClick={() => {navigate("/productos")}}
                            className="px-6 py-3 border-2 border-morado text-morado rounded-full font-medium flex items-center justify-center hover:bg-purple-50 transition-colors"
                        >
                            Ver productos
                        </button>

                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 left-10 h-20 w-20 rounded-full bg-[#7912B0]/10 animate-float"></div>
            <div className="absolute bottom-1/4 right-10 h-12 w-12 rounded-full bg-[#7912B0]/20 animate-float animation-delay-500"></div>
        </section>
    );
}
