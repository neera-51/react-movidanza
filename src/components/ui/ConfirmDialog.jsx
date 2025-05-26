import React from "react";

const colorClasses = {
  red: {
    bg: "bg-red-600",
    hoverBg: "hover:bg-red-700",
    titleColor: "#dc2626",
    btnText: "text-white",
  },
  purple: {
    bg: "bg-morado",
    hoverBg: "hover:bg-[#6b0fa2]",
    titleColor: "morado",
    btnText: "text-white",
  },
  black: {
    bg: "bg-black",
    hoverBg: "hover:bg-gray-800",
    titleColor: "#000000",
    btnText: "text-white",
  },
};

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  onCancel,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  color = "red",
}) {
  if (!isOpen) return null;

  const btnColor = colorClasses[color] || colorClasses.red;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-lg max-w-sm mx-auto">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: btnColor.titleColor }}
        >
          {title}
        </h2>
        <p className="mb-6 text-gray-900">{description}</p>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-100"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`${btnColor.bg} ${btnColor.hoverBg} ${btnColor.btnText} px-4 py-2 rounded-md border border-gray-200`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
