import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import ConfirmDialog from "../ui/ConfirmDialog";
import {
  LogOut,
} from "lucide-react";

export default function LogoutButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleConfirmLogout = async () => {
    closeDialog();
    try {
      await logout();
      // limpiar tokens, estado global, etc si tienes
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <>
      <button
        onClick={openDialog}
        className="flex items-center gap-2 w-full px-2 py-1 rounded text-red-600 hover:bg-red-500 hover:text-white"
      >
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </button>

      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Confirmar cierre de sesión"
        description="¿Estás seguro que quieres cerrar sesión?"
        onCancel={closeDialog}
        onConfirm={handleConfirmLogout}
        confirmText="Cerrar sesión"
      />
    </>
  );
}
