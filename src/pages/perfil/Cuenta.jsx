import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../../hooks/context/UserContext";
import useAuth from "../../hooks/api/useAuth";
import useUsuario from "../../hooks/api/useUsuario";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import CampoEditable from "../../components/CampoEditable";
import CambioContraseña from "../../components/perfil/CambioContraseña";
import { Button } from "../../components/ui/Button";
import Toast from "../../components/ui/Toast";
import { capitalize } from "../../utils/textUtils"


export default function Cuenta() {
  const { user, checking, setUser } = useUser();
  const { getUsuarioById, updateUsuario, deleteUsuario } = useUsuario();
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [usuarioActual, setUsuarioActual] = useState(null);

  const [editando, setEditando] = useState({ nombre: false, email: false, telefono: false });
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");

  const [cambiarPass, setCambiarPass] = useState(false);
  const [contraseñaActual, setContraseñaActual] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    onConfirm: () => { },
    color: "purple",
  });

  // Estado para manejar Toast
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");
  const [toastVisible, setToastVisible] = useState(false);

  const nombresCampos = {
    nombre: "Nombre",
    email: "Correo electrónico",
    telefono: "Teléfono",
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      if (user?.id) {
        const data = await getUsuarioById(user.id);
        setUsuarioActual(data);
        setNuevoNombre(data.nombre || "");
        setNuevoEmail(data.email || "");

        // Formatear teléfono antes de setearlo
        const telefonoFormateado = data.telefono ? formatearTelefono(data.telefono) : "";
        setNuevoTelefono(telefonoFormateado);
      }
    };
    fetchUsuario();
  }, [user]);

  // Extraemos la carga en una función
  const refrescarDatos = async () => {
    if (user?.id) {
      const data = await getUsuarioById(user.id);
      setUsuarioActual(data);
      setNuevoNombre(data.nombre || "");
      setNuevoEmail(data.email || "");
      const telefonoFormateado = data.telefono ? formatearTelefono(data.telefono) : "";
      setNuevoTelefono(telefonoFormateado);
    }
  };

  useEffect(() => {
    refrescarDatos();
  }, [user]);


  const mostrarConfirmacion = ({ title, description, onConfirm, color = "purple" }) => {
    setDialogConfig({ title, description, onConfirm, color });
    setDialogOpen(true);
  };

  // Función para mostrar mensaje en Toast con tipo
  const showToast = (msg, tipo = "success") => {
    setMensaje(msg);
    setTipo(tipo);
    setToastVisible(true);
  };
  const handleChangeCampo = (campo, valor) => {
    let nuevoValor = valor;

    if (campo === "nombre") {
      // Elimina caracteres inválidos pero NO recorta aún los espacios al final
      nuevoValor = nuevoValor
        .replace(/[^a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]/g, "")
        .replace(/\s{2,}/g, " ");

      // Contar palabras sin eliminar espacios al final
      const palabras = nuevoValor.trim().split(/\s+/);
      if (palabras.length > 5) return; // ❌ impide más de 5 palabras

      setNuevoNombre(nuevoValor); // ✅ acepta espacio al final si no pasa de 5 palabras
    }



    if (campo === "email") {
      // Forzar minúsculas y validar formato básico
      nuevoValor = nuevoValor.toLowerCase();

      setNuevoEmail(nuevoValor);
    }

    if (campo === "telefono") {
      // Solo permitir números, eliminar letras y caracteres especiales
      nuevoValor = nuevoValor.replace(/[^\d]/g, "");

      if (nuevoValor.length > 9) return;

      // Formato: 600 00 00 00
      const formateado = nuevoValor
        .replace(/^(\d{3})(\d{0,2})(\d{0,2})(\d{0,2})$/, (_, a, b, c, d) => {
          return [a, b, c, d].filter(Boolean).join(" ");
        });

      setNuevoTelefono(formateado);
    }
  };

  function formatearTelefono(telefono) {
    return telefono.replace(/^(\d{3})(\d{0,2})(\d{0,2})(\d{0,2})$/, (_, a, b, c, d) => {
      return [a, b, c, d].filter(Boolean).join(" ");
    });
  }


  const handleGuardar = (campo) => {

    const actualizacion = {};

    if (campo === "nombre") {
      const nombreLimpio = nuevoNombre.trim().replace(/\s{2,}/g, " ");
      const palabras = nombreLimpio.split(" ");

      if (palabras.length === 0 || palabras.length > 5) {
        showToast("El nombre debe contener entre 1 y 5 palabras.", "error");
        return;
      }

      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'".-]+$/.test(nombreLimpio)) {
        showToast("El nombre contiene caracteres inválidos o números.", "error");
        return;
      }

      const nombreCapitalizado = capitalize(nombreLimpio);
      actualizacion.nombre = nombreCapitalizado;
    }


    if (campo === "email") {
      if (!nuevoEmail.trim()) {
        showToast("El correo no puede estar vacío.", "error");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevoEmail)) {
        showToast("Formato de correo inválido.", "error");
        return;
      }

      actualizacion.email = nuevoEmail.toLowerCase();
    }

    if (campo === "telefono") {
      // Eliminar espacios antes de guardar
      const telefonoLimpio = nuevoTelefono.replace(/\s+/g, '');

      if (!/^\d{9}$/.test(telefonoLimpio)) {
        showToast("El teléfono debe tener 9 dígitos sin espacios.", "error");
        return;
      }

      actualizacion.telefono = telefonoLimpio;
    }


    mostrarConfirmacion({
      title: `¿Actualizar ${nombresCampos[campo]}?`,
      description: `¿Estás seguro de que deseas guardar los cambios en el campo ${nombresCampos[campo]}?`,
      onConfirm: async () => {
        try {
          const res = await updateUsuario(user.id, actualizacion);
          await refrescarDatos(); // Refrescar datos después de la actualización
          setUsuarioActual(res.usuarioActualizado || usuarioActual);
          setEditando({ nombre: false, email: false, telefono: false });
          showToast("Campo actualizado correctamente", "success");
        } catch {
          showToast("Error actualizando campo", "error");
        } finally {
          setDialogOpen(false);
        }
      },
    });
  };

  const handleCancelar = (campo) => {
    setEditando((prev) => ({ ...prev, [campo]: false }));
    if (campo === "nombre") setNuevoNombre(usuarioActual.nombre || "");
    if (campo === "email") setNuevoEmail(usuarioActual.email || "");
    if (campo === "telefono") {
      setNuevoTelefono(usuarioActual.telefono ? formatearTelefono(usuarioActual.telefono) : "");
    }

    // También oculta el toast si está visible
    setToastVisible(false);
    setMensaje("");
  };

  const handleGuardarNuevaContraseña = () => {
    if (!contraseñaActual || !nuevaContraseña || !confirmarContraseña) {
      showToast("Completa todos los campos de contraseña.", "error");
      return;
    }

    if (nuevaContraseña !== confirmarContraseña) {
      showToast("La nueva contraseña y la confirmación no coinciden.", "error");
      return;
    }

    if (nuevaContraseña.length < 6) {
      showToast("La nueva contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    mostrarConfirmacion({
      title: "Confirmar cambio de contraseña",
      description: "¿Estás seguro de que deseas cambiar tu contraseña?",
      color: "purple",
      onConfirm: async () => {
        try {
          await login({ email: usuarioActual.email, password: contraseñaActual });
        } catch {
          showToast("La contraseña actual no es correcta.", "error");
          setDialogOpen(false);
          return;
        }

        try {
          await updateUsuario(user.id, { password: nuevaContraseña });
          showToast("Contraseña actualizada correctamente.", "success");
          setContraseñaActual("");
          setNuevaContraseña("");
          setConfirmarContraseña("");
          setCambiarPass(false);
        } catch {
          showToast("Error al actualizar la contraseña.", "error");
        } finally {
          setDialogOpen(false);
        }
      },
    });
  };

  const handleEliminarUsuario = () => {
    mostrarConfirmacion({
      title: "Eliminar cuenta",
      description: "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
      color: "red",
      onConfirm: async () => {
        try {
          await deleteUsuario(user.id);
          showToast("Usuario eliminado correctamente.", "success"); // Mensaje de éxito
          logout();
          setUser(null)
          navigate("/");
        } catch (e) {
          showToast("Error al eliminar el usuario.", "error");
        } finally {
          setDialogOpen(false);
        }
      },
    });
  };


  if (checking || !usuarioActual) return <div>Cargando datos...</div>;

  return (
    <div className="max-w-[500px] mx-auto mt-4">
      <h1 className="text-4xl font-bold mb-4">Mi Cuenta</h1>

      {toastVisible && (
        <Toast mensaje={mensaje} tipo={tipo} onClose={() => setToastVisible(false)} />
      )}

      <CampoEditable
        label="Nombre"
        placeholder="Nombre"
        valor={nuevoNombre}
        setValor={(valor) => handleChangeCampo("nombre", valor)}
        campo="nombre"
        editando={editando}
        setEditando={setEditando}
        onGuardar={handleGuardar}
        onCancelar={handleCancelar}
        maxLength={150}

      />

      <CampoEditable
        label="Correo"
        placeholder="m@ejemplo.com"
        valor={nuevoEmail}
        setValor={(valor) => handleChangeCampo("email", valor)}
        campo="email"
        editando={editando}
        setEditando={setEditando}
        onGuardar={handleGuardar}
        onCancelar={handleCancelar}
        maxLength={75}
      />

      <CampoEditable
        label="Teléfono"
        placeholder="Teléfono"
        valor={nuevoTelefono}
        setValor={(valor) => handleChangeCampo("telefono", valor)}
        campo="telefono"
        editando={editando}
        setEditando={setEditando}
        onGuardar={handleGuardar}
        onCancelar={handleCancelar}
        maxLength={13}
      />


      <label className="block text-xl font-semibold text-morado mt-6">
        Contraseña
      </label>

      <div className="mt-2 mb-6">
        <div className="w-full border-t border-gray-300" />
      </div>

      {!cambiarPass ? (
        <Button variant="purple" onClick={() => setCambiarPass(true)}>Cambiar contraseña</Button>
      ) : (
        <CambioContraseña
          usuarioActual={usuarioActual}
          contraseñaActual={contraseñaActual}
          nuevaContraseña={nuevaContraseña}
          confirmarContraseña={confirmarContraseña}
          setContraseñaActual={setContraseñaActual}
          setNuevaContraseña={setNuevaContraseña}
          setConfirmarContraseña={setConfirmarContraseña}
          onGuardar={handleGuardarNuevaContraseña}
          onCancelar={() => {
            setCambiarPass(false);
            setContraseñaActual("");
            setNuevaContraseña("");
            setConfirmarContraseña("");
            setToastVisible(false);
            setMensaje("");
          }}
          maxLength={50}
        />
      )}

      <label className="block text-xl font-semibold text-red-600 mt-6">
        Eliminar cuenta
      </label>

      <div className="mt-2 mb-6">
        <div className="w-full border-t border-gray-300" />
      </div>

      <Button variant="red" onClick={handleEliminarUsuario}>
        Eliminar cuenta
      </Button>

      <ConfirmDialog
        isOpen={dialogOpen}
        title={dialogConfig.title}
        description={dialogConfig.description}
        onCancel={() => setDialogOpen(false)}
        onConfirm={dialogConfig.onConfirm}
        color={dialogConfig.color}
      />
    </div>
  );
}
