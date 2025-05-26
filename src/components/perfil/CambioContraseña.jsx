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
}) {
  return (
    <div className="mt-4 space-y-3">
      <Input
        type="password"
        placeholder="Contraseña actual"
        value={contraseñaActual}
        onChange={(e) => setContraseñaActual(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Nueva contraseña"
        value={nuevaContraseña}
        onChange={(e) => setNuevaContraseña(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Confirmar nueva contraseña"
        value={confirmarContraseña}
        onChange={(e) => setConfirmarContraseña(e.target.value)}
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
