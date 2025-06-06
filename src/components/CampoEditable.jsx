import React from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export default function CampoEditable({
  label,
  placeholder,
  valor,
  setValor,
  campo,
  editando,
  setEditando,
  onGuardar,
  onCancelar,
  maxLength,
}) {
  const handleEditarClick = () => {
    setEditando({
      nombre: campo === "nombre",
      email: campo === "email",
      telefono: campo === "telefono",
    });
  };

  return (
    <div className="mb-6">
      <label className="block font-semibold text-morado text-xl">
        {label}
      </label>

            {/* Línea separadora suave en gris claro */}
      <div className="mt-2 mb-6">
        <div className="w-3/3 border-t border-gray-300" />
      </div>

      {!editando[campo] ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Input value={valor} placeholder={placeholder} readOnly />
          <Button
           variant="purple" 
            onClick={handleEditarClick}
            disabled={Object.values(editando).some((v) => v)}
          >
            Editar
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Input
            value={valor}
            placeholder={placeholder}
            onChange={(e) => setValor(e.target.value)}
            maxLength={maxLength}
          />
          <div className="flex gap-2">
            <Button variant="purple" onClick={() => onGuardar(campo)}>Guardar</Button>
            <Button variant="outline" onClick={() => onCancelar(campo)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
      
    </div>
  );
}
