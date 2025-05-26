import React from "react";

// Solo se mostrarán los campos que tengan valor
export default function DireccionCard({
    nombre,
    apellido,
    pais,
    calle_avenida,
    numero,
    edificio,
    escalera,
    piso,
    letra,
    codigoPostal,
    telefono,
    localidad,
    provincia,
    predeterminada = false,
    onEditar,
    onEliminar,
    onSeleccionarPredeterminada,
}) {
    return (
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white h-full flex flex-col justify-between">
            {predeterminada && (
                <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-800">Predeterminada</p>
                    <div className="mt-2 border-t border-gray-300" />
                </div>
            )}

            <div className="text-sm text-gray-700 space-y-1 mb-4">
                {(nombre || apellido) && (
                    <p className="font-bold">
                        {[nombre, apellido].filter(Boolean).join(" ")}
                    </p>
                )}
                {(calle_avenida || numero || piso || letra) && (
                    <p>
                        {[calle_avenida, numero && `Nº ${numero}`].filter(Boolean).join(" ")}
                        {piso && `, Piso ${piso}`}
                        {letra && `, ${letra}`}
                    </p>
                )}
                {edificio && <p>Edificio: {edificio}</p>}
                {escalera && <p>Escalera: {escalera}</p>}
                {(localidad || provincia || codigoPostal) && (
                    <p>
                        {[localidad, provincia].filter(Boolean).join(", ")}{" "}
                        {codigoPostal && `(${codigoPostal})`}
                    </p>
                )}
                {pais && <p>{pais}</p>}
                {telefono && <p className="mt-2">Teléfono: {telefono}</p>}
            </div>

            <div className="flex flex-wrap gap-x-2 text-sm text-blue-600 items-center">
                {onEditar && (
                    <>
                        <button
                            onClick={onEditar}
                            className="hover:underline focus:outline-none"
                        >
                            Editar
                        </button>
                    </>
                )}

                {onEditar && (onEliminar || (!predeterminada && onSeleccionarPredeterminada)) && (
                    <span className="text-gray-400">|</span>
                )}

                {onEliminar && (
                    <>
                        <button
                            onClick={onEliminar}
                            className="hover:underline focus:outline-none"
                        >
                            Descartar
                        </button>
                    </>
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
