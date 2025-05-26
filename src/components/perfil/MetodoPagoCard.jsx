import { FaCcVisa, FaCcMastercard, FaPaypal } from "react-icons/fa";

function ocultarEmail(email) {
    if (!email) return '';
    const [usuario, dominio] = email.split("@");
    if (!dominio) return email;
    if (usuario.length <= 2) return `****@${dominio}`;
    const visible = usuario.slice(0, 2);
    return `${visible}****@${dominio}`;
}

export default function MetodoPagoCard({
    tipo,
    ultimos_digitos,
    tarjeta_tipo,
    nombre_titular,
    correo_asociado,
    predeterminada = false,
    onEditar,
    onEliminar,
    onSeleccionarPredeterminada,
}) {
    const esTarjeta = tipo === "tarjeta";

    const icono = esTarjeta
        ? tarjeta_tipo === "visa"
            ? <FaCcVisa className="text-blue-600 text-2xl" />
            : <FaCcMastercard className="text-red-600 text-2xl" />
        : <FaPaypal className="text-blue-500 text-2xl" />;

    const textoSecundario = esTarjeta
        ? `**** **** **** ${ultimos_digitos}`
        : ocultarEmail(correo_asociado);

    const titulo = esTarjeta ? "Tarjeta" : "PayPal";

    return (
        <div className="w-full max-w-sm min-w-[280px] border border-gray-200 rounded-lg p-4 shadow-sm bg-white h-full flex flex-col justify-between">
            {predeterminada && (
                <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-800">Predeterminada</p>
                    <div className="mt-2 border-t border-gray-300" />
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm text-gray-500">{titulo}</p>
                    <p className="font-semibold text-gray-800">{nombre_titular || '-'}</p>
                    <p className="text-sm text-gray-600">{textoSecundario}</p>
                </div>
                <div>{icono}</div>
            </div>

            <div className="flex flex-wrap gap-x-2 text-sm text-blue-600 items-center">
                {onEditar && (
                    <button onClick={onEditar} className="hover:underline focus:outline-none">
                        Editar
                    </button>
                )}
                {onEditar && (onEliminar || (!predeterminada && onSeleccionarPredeterminada)) && (
                    <span className="text-gray-400">|</span>
                )}
                {onEliminar && (
                    <button onClick={onEliminar} className="hover:underline focus:outline-none">
                        Descartar
                    </button>
                )}
                {onEliminar && !predeterminada && onSeleccionarPredeterminada && (
                    <span className="text-gray-400">|</span>
                )}
                {!predeterminada && onSeleccionarPredeterminada && (
                    <button
                        onClick={onSeleccionarPredeterminada}
                        className="hover:underline focus:outline-none"
                    >
                        Definir como predeterminada
                    </button>
                )}
            </div>
        </div>
    );
}
