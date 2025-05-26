import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import MetodoPagoCard from "../../components/perfil/MetodoPagoCard";
import AgregarMetodoPagoCard from "../../components/perfil/AgregarMetodoPagoCard";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Toast from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import FormularioMetodoPago from "./formularios/FormularioMetodoPago";
import useUser from "../../hooks/useUserAuth";
import useMetodoPago from "../../hooks/useMetodoPago";
import { useMatch } from "react-router-dom";

export default function MetodosPago() {
  const { user, checking } = useUser();
  const { getMetodoPagoByIdUsuario, updateMetodoPago, deleteMetodoPago } = useMetodoPago();

  const [metodosPago, setMetodosPago] = useState([]);
  const [cargando, setCargando] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const matchNueva = useMatch("/userProfile/metodos_pago/nueva");
  const matchEditar = useMatch("/userProfile/metodos_pago/editar/:id");

  useEffect(() => {
    console.log("Usuario:", user);
    if (!checking && user?.id) {
      fetchMetodosPago();
    }
  }, [checking, user]);


  // Lógica de detección de modo del modal

  const obtenerModoModal = () => {
    if (matchNueva) {
      return { modo: "crear", id: null };
    } else if (matchEditar) {
      return { modo: "editar", id: parseInt(matchEditar.params.id) };
    } else {
      return { modo: null, id: null };
    }
  };

  const { modo, id: idEditar } = obtenerModoModal();


  // Confirm dialog y toast

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    onConfirm: () => { },
    color: "purple",
  });

  const mostrarConfirmacion = ({ title, description, onConfirm, color = "purple" }) => {
    setDialogConfig({ title, description, onConfirm, color });
    setDialogOpen(true);
  };

  const [toast, setToast] = useState({ visible: false, mensaje: "", tipo: "success" });

  const mostrarToast = (mensaje, tipo = "success") => {
    setToast({ visible: true, mensaje, tipo });
  };


  // Cargar métodos de pago del usuario

  const fetchMetodosPago = async () => {
    if (user?.id) {
      setCargando(true);
      try {
        const res = await getMetodoPagoByIdUsuario(user.id);
        console.log("Métodos de pago:", res);
        setMetodosPago(res);
      } catch (error) {
        console.error("Error al obtener métodos de pago:", error);
      } finally {
        setCargando(false);
      }
    }
  };


  // Acciones sobre métodos de pago

  const manejarSeleccionPredeterminada = async (idSeleccionado) => {
    mostrarConfirmacion({
      title: "Establecer método predeterminado",
      description: "¿Deseas establecer este método de pago como predeterminado?",
      color: "purple",
      onConfirm: async () => {
        try {
          // Buscar el método seleccionado
          const seleccionado = metodosPago.find((mp) => mp.id === idSeleccionado);
          if (!seleccionado) return; // Si no se encuentra, salir

          if (seleccionado.predeterminada) return; // Ya es predeterminado

          // Buscar el anterior método predeterminado
          const anterior = metodosPago.find((mp) => mp.predeterminada);
          if (anterior && anterior.id !== idSeleccionado) {
            await updateMetodoPago(anterior.id, { predeterminada: false });
          }
          await updateMetodoPago(idSeleccionado, { predeterminada: true });

          const actualizado = metodosPago.map((mp) => ({
            ...mp,
            predeterminada: mp.id === idSeleccionado,
          }));

          setMetodosPago(actualizado);
        } catch (error) {
          console.error("Error al actualizar método predeterminado:", error);
        } finally {
          setDialogOpen(false);
        }
      },
    });
  };

  const handleDeleteMetodoPago = (id) => {
    /* const metodo = metodosPago.find((m) => m.id === id);
    if (metodo?.predeterminada) {
      mostrarToast("No puedes eliminar el método predeterminado.", "error");
      return;
    } */

    mostrarConfirmacion({
      title: "Eliminar método de pago",
      description: "¿Estás seguro de que deseas eliminar este método de pago?",
      color: "red",
      onConfirm: async () => {
        try {
          await deleteMetodoPago(id);
          setMetodosPago((prev) => prev.filter((m) => m.id !== id));
        } catch (error) {
          console.error("Error al eliminar método de pago:", error);
          mostrarToast("Hubo un error al eliminar el método de pago.", "error");
        } finally {
          setDialogOpen(false);
        }
      },
    });
  };


  // Cerrar el modal

  const cerrarModal = () => {
    navigate("/userProfile/metodos_pago");
  };


  // Método de pago a editar

  const metodoPagoAEditar = idEditar
    ? metodosPago.find((m) => m.id === idEditar)
    : null;

  if (checking || cargando) return <div>Cargando métodos de pago...</div>;


  return (
    <div className="mx-auto mt-4 max-w-7xl px-4">
      <h1 className="text-4xl font-bold mb-2">Métodos de Pago</h1>
      <p className="text-gray-500 mb-6">Aquí puedes gestionar tus métodos de pago.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AgregarMetodoPagoCard onClick={() => navigate("/userProfile/metodos_pago/nueva")} />

        {metodosPago.map((metodoP) => (
          <MetodoPagoCard
            key={metodoP.id}
            {...metodoP}
            onSeleccionarPredeterminada={() => manejarSeleccionPredeterminada(metodoP.id)}
            onEditar={() => navigate(`/userProfile/metodos_pago/editar/${metodoP.id}`)}
            onEliminar={() => handleDeleteMetodoPago(metodoP.id)}
          />
        ))}
      </div>

      <ConfirmDialog
        isOpen={dialogOpen}
        title={dialogConfig.title}
        description={dialogConfig.description}
        onCancel={() => setDialogOpen(false)}
        onConfirm={dialogConfig.onConfirm}
        color={dialogConfig.color}
      />

      {toast.visible && (
        <Toast
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}

      {modo === "crear" && (
        <Modal onClose={cerrarModal}>
          <FormularioMetodoPago
            onSuccess={() => {
              mostrarToast('Método de pago agregado correctamente', 'success');
              cerrarModal();
              fetchMetodosPago();
            }}
            onCancel={cerrarModal}
            mostrarToast={mostrarToast}
          />
        </Modal>
      )}

      {modo === "editar" && (
        <Modal onClose={cerrarModal}>
          {metodoPagoAEditar ? (
            <FormularioMetodoPago
              metodoPago={metodoPagoAEditar}
              onSuccess={() => {
                mostrarToast('Método de pago actualizado correctamente', 'success');
                cerrarModal();
                fetchMetodosPago();
              }}
              onCancel={cerrarModal}
              mostrarToast={mostrarToast}
            />
          ) : (
            <div className="p-4">Cargando método de pago...</div>
          )}
        </Modal>
      )}


      {/* <Outlet /> */}
    </div>
  );
}
