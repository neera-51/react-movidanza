import { ArrowLeft } from "lucide-react";

export default function FlechaVolver() {
    return (
        <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#7912B0] transition-colors"
        >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver</span>
        </button>
    );
}