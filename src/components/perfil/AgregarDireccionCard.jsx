import React from "react";

export default function AgregarDireccionCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 shadow-sm bg-white flex items-center justify-center h-full min-h-[200px] hover:bg-gray-50"
    >
      <span className="text-blue-600 font-semibold text-center text-lg">+ Añadir nueva dirección</span>
    </div>
  );
}
