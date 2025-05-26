import React from "react";

export default function AgregarMetodoPagoCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer max-w-sm w-full border border-dashed border-gray-400 rounded-lg p-4 flex items-center justify-center text-blue-600 hover:bg-gray-50 transition h-full"
    >
      <p className="text-lg font-semibold">+ Agregar Método de Pago</p>
    </div>
  );
}
