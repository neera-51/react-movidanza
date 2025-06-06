import React from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export default function CambioContraseña({
  contraseñaActual,
  nuevaContraseña,
  confirmarContraseña,
  setContraseñaActual,
  setNuevaContraseña,
  setConfirmarContraseña,
  onGuardar,
  onCancelar,
  maxLength,
}) {
  return (
    <div className="mt-4 space-y-3">
      <Input
        type="password"
        placeholder="Contraseña actual"
        value={contraseñaActual}
        onChange={(e) => setContraseñaActual(e.target.value)}
        maxLength={maxLength}
      />
      <Input
        type="password"
        placeholder="Nueva contraseña"
        value={nuevaContraseña}
        onChange={(e) => setNuevaContraseña(e.target.value)}
        maxLength={maxLength}
      />
      <Input
        type="password"
        placeholder="Confirmar nueva contraseña"
        value={confirmarContraseña}
        onChange={(e) => setConfirmarContraseña(e.target.value)}
        maxLength={maxLength}
      />
      <div className="flex gap-2">
        <Button variant="purple" onClick={onGuardar}>Guardar</Button>
        <Button variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
