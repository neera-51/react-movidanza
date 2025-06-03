import React from "react";

export default function AgregarMetodoPagoCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer max-w-sm w-full border-2 border-dashed border-gray-300 rounded-lg p-4 shadow-sm bg-white flex items-center justify-center hover:bg-gray-50 transition h-full"
    >
      <p className="text-blue-600 text-center text-lg font-semibold">+ Agregar Método de Pago</p>
    </div>
  );
}
