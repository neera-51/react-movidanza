import React, { useState, useEffect } from "react";
import { useNavigate, useLocation /*, useParams */, Outlet } from "react-router-dom";
import { useUser } from "../../hooks/context/UserContext";
import useUsuarioDireccion from "../../hooks/api/useUsuarioDireccion";
import useDireccion from "../../hooks/api/useDireccion";
import DireccionCard from "../../components/perfil/DireccionCard";
import AgregarDireccionCard from "../../components/perfil/AgregarDireccionCard";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Toast from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import FormularioDireccion from "./formularios/FormularioDireccion";

export default function Direcciones() {
    const { user, checking } = useUser();
    const { getUsuarioDireccionByUsuarioId, updateUsuarioDireccion } = useUsuarioDireccion();
    const { deleteDireccion } = useDireccion();

    const [direcciones, setDirecciones] = useState([]);
    const [cargando, setCargando] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    // const { id } = useParams(); // Alternativa si defines ruta con :id


    // Lógica de detección de modo del modal

    const obtenerModoModal = (pathname) => {
        if (pathname.endsWith("/nueva")) return { modo: "crear" };
        const match = pathname.match(/\/userProfile\/direcciones\/editar\/(\d+)$/);
        if (match) return { modo: "editar", id: parseInt(match[1]) };
        return { modo: null };
    };

    const { modo, id: idEditar } = obtenerModoModal(location.pathname);


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


    // Cargar direcciones del usuario

    const fetchDirecciones = async () => {
        if (user?.id) {
            setCargando(true);
            try {
                const res = await getUsuarioDireccionByUsuarioId(user.id);
                const direcciones = res.map((item) => {
                    const d = item.direccion;
                    return {
                        id: item.id, // ID de la relación entre usuario y dirección
                        id_direccion: d.id,
                        nombre: d.nombre || "",
                        apellido: d.apellido || "",
                        pais: d.pais || "España",
                        calle_avenida: d.calle_avenida,
                        numero: d.numero,
                        edificio: d.edificio || "",
                        escalera: d.escalera || "",
                        piso: d.piso || "",
                        letra: d.letra || "",
                        codigo_postal: d.codigo_postal,
                        telefono: d.telefono || "",
                        localidad: d.localidad,
                        provincia: d.provincia || "",
                        predeterminada: item.predeterminada,
                        referencia: d.referencia || "",
                    };
                });
                setDirecciones(direcciones);
            } catch (error) {
                console.error("Error al obtener direcciones:", error);
            } finally {
                setCargando(false);
            }
        }
    };

    useEffect(() => {
        fetchDirecciones();
    }, [user]);


    // Acciones sobre direcciones

    const manejarSeleccionPredeterminada = async (idSeleccionado) => {
        mostrarConfirmacion({
            title: "Establecer dirección predeterminada",
            description: "¿Estás seguro de que deseas establecer esta dirección como predeterminada?",
            color: "purple",
            onConfirm: async () => {
                try {
                    const anterior = direcciones.find((dir) => dir.predeterminada);
                    if (anterior && anterior.id !== idSeleccionado) {
                        await updateUsuarioDireccion(anterior.id, { predeterminada: false });
                    }
                    await updateUsuarioDireccion(idSeleccionado, { predeterminada: true });

                    const actualizado = direcciones.map((dir) => ({
                        ...dir,
                        predeterminada: dir.id === idSeleccionado,
                    }));

                    setDirecciones(actualizado);
                } catch (error) {
                    console.error("Error al actualizar dirección predeterminada:", error);
                } finally {
                    setDialogOpen(false);
                }
            },
        });
    };

    const handleDeleteDireccion = (id_direccion) => {
        const direccion = direcciones.find((d) => d.id_direccion === id_direccion);

/*         if (direccion?.predeterminada) {
            mostrarToast("No puedes eliminar una dirección predeterminada.", "error");
            return;
        } */

        mostrarConfirmacion({
            title: "Eliminar dirección",
            description: "¿Estás seguro de que deseas eliminar esta dirección?",
            color: "red",
            onConfirm: async () => {
                try {
                    await deleteDireccion(id_direccion);
                    setDirecciones((prev) =>
                        prev.filter((direccion) => direccion.id_direccion !== id_direccion)
                    );
                } catch (error) {
                    console.error("Error al eliminar dirección:", error);
                    mostrarToast("Hubo un error al eliminar la dirección.", "error");
                } finally {
                    setDialogOpen(false);
                }
            },
        });
    };


    // Cerrar el modal

    const cerrarModal = () => {
        navigate("/userProfile/direcciones");
    };


    // Dirección a editar

    const direccionAEditar = idEditar
        ? direcciones.find((d) => d.id_direccion === idEditar)
        : null;

    if (checking || cargando) return <div>Cargando direcciones...</div>;

    return (
        <div className="mx-auto mt-4 max-w-7xl px-4">
            <h1 className="text-4xl font-bold mb-4">Mis Direcciones</h1>
            <p className="text-gray-500 mb-6">Aquí puedes gestionar tus direcciones de envío.</p>


            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <AgregarDireccionCard onClick={() => navigate("/userProfile/direcciones/nueva")} />

                {direcciones.map((dir) => (
                    <DireccionCard
                        key={dir.id}
                        {...dir}
                        onSeleccionarPredeterminada={() => manejarSeleccionPredeterminada(dir.id)}
                        onEditar={() => navigate(`/userProfile/direcciones/editar/${dir.id_direccion}`)}
                        onEliminar={() => handleDeleteDireccion(dir.id_direccion)}
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

            {/* Modal de nueva dirección */}
            {modo === "crear" && (
                <Modal onClose={cerrarModal}>
                    <FormularioDireccion
                        onSuccess={() => {
                            mostrarToast("Dirección creada con éxito.", "success");
                            cerrarModal();
                            fetchDirecciones();
                        }}
                        onCancel={cerrarModal}
                        mostrarToast={mostrarToast}
                    />
                </Modal>
            )}

            {/* Modal de edición de dirección */}
            {modo === "editar" && (
                <Modal onClose={cerrarModal}>
                    {direccionAEditar ? (
                        <FormularioDireccion
                            direccion={direccionAEditar}
                            onSuccess={() => {
                                mostrarToast("Dirección actualizada con éxito.", "success");
                                cerrarModal();
                                fetchDirecciones();
                            }}
                            onCancel={cerrarModal}
                            mostrarToast={mostrarToast}
                        />
                    ) : (
                        <div className="p-4">Cargando dirección...</div>
                    )}
                </Modal>
            )}

            <Outlet />
        </div>
    );
}
