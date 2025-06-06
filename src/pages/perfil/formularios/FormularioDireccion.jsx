import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/context/UserContext";
import useDireccion from "../../../hooks/api/useDireccion";
import useUsuarioDireccion from "../../../hooks/api/useUsuarioDireccion";
import Toast from "../../../components/ui/Toast";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { capitalize } from "../../../utils/textUtils"

export default function FormularioDireccion({ onSuccess, onCancel, direccion = "" }) {
    const { user } = useUser();
    const { createDireccion, updateDireccion } = useDireccion();
    const { createUsuarioDireccion, getUsuarioDireccionByUsuarioId, updateUsuarioDireccion } = useUsuarioDireccion();
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
        pais: "España",
        calle_avenida: "",
        numero: "",
        edificio: "",
        escalera: "",
        piso: "",
        letra: "",
        codigo_postal: "",
        localidad: "",
        provincia: "",
        referencia: "",
    });

    const [predeterminada, setPredeterminada] = useState(false);
    const [otrasPredeterminadas, setOtrasPredeterminadas] = useState([]); // <-- Estado para otras direcciones predeterminadas
    const [toast, setToast] = useState({ visible: false, mensaje: "", tipo: "success" });

    const mostrarToast = (mensaje, tipo = "success") => {
        setToast({ visible: true, mensaje, tipo });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;


        if (name === "telefono") {
            const soloDigitos = value.replace(/\D/g, "").slice(0, 9); // solo dígitos
            const conFormato = soloDigitos
                .replace(/^(\d{3})(\d{0,2})(\d{0,2})(\d{0,2}).*/, (_, a, b, c, d) =>
                    [a, b, c, d].filter(Boolean).join(" ")
                );
            setFormulario(prev => ({ ...prev, [name]: conFormato }));
            return;
        }


        if (name === "numero" || name === "piso") {
            const valorNumerico = Number(value);
            if (value === "") {
                setFormulario(prev => ({ ...prev, [name]: "" }));
            } else if (!isNaN(valorNumerico) && valorNumerico >= 0) {
                setFormulario(prev => ({ ...prev, [name]: valorNumerico }));
            }
            return;
        }

        if (name === "pais") {
            // Siempre forzar a "España"
            setFormulario(prev => ({ ...prev, pais: "España" }));
            return;
        }

        if (["nombre", "letra", "apellido", "calle_avenida", "localidad", "provincia"].includes(name)) {
            // Rechazar si hay números, caracteres especiales o espacios dobles
            if (/[^a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]/.test(value) || /\s{2,}/.test(value)) {
                return; // No actualizar estado ni input
            }
        }

        // Para todos los demás campos
        setFormulario(prev => ({ ...prev, [name]: value }));
    };

    const camposObligatorios = [
        "nombre", "apellido", "telefono", "calle_avenida", "numero",
        "codigo_postal", "localidad", "provincia"
    ];

    const paisesValidos = ["España", /* otros países si hubiera */];

    const validarCampos = () => {
        for (const campo of camposObligatorios) {
            if (!formulario[campo]?.toString().trim()) {
                mostrarToast(`El campo "${campo}" es obligatorio.`, "error");
                return false;
            }
        }

        // Validar que el país esté en la lista válida
        if (!paisesValidos.includes(formulario.pais)) {
            mostrarToast(`El país "${formulario.pais}" no es válido.`, "error");
            return false;
        }

        // Regex: permite letras, tildes, diéresis, guiones, apóstrofes, espacios; pero NO números
        const regexSinNumeros = /^[^0-9]+$/;

        const camposTextoSinNumeros = [
            { campo: "nombre", etiqueta: "El nombre" },
            { campo: "apellido", etiqueta: "El apellido" },
            { campo: "provincia", etiqueta: "La provincia" },
            { campo: "calle_avenida", etiqueta: "La calle o avenida" },
            { campo: "localidad", etiqueta: "La localidad" },
        ];

        for (const { campo, etiqueta } of camposTextoSinNumeros) {
            if (!regexSinNumeros.test(formulario[campo])) {
                mostrarToast(`${etiqueta} no debe contener números.`, "error");
                return false;
            }
        }

        return true;
    };

    // Validación extra incluyendo letra sin números ni más de un carácter
    const validarCamposExtra = () => {
        const { numero, piso, letra, telefono } = formulario;

        if (numero !== null) {
            if (numero < 1 || numero > 9999) {
                mostrarToast("El número debe estar entre 1 y 9999.", "error");
                return false;
            }
        }

        if (piso !== null) {
            if (piso < 0 || piso > 200) {
                mostrarToast("El piso debe estar entre 0 y 200.", "error");
                return false;
            }
        }

        if (letra) {
            if (letra.length !== 1) {
                mostrarToast("La letra debe ser solo un carácter.", "error");
                return false;
            }
            if (!/^[A-Za-z]$/.test(letra)) {
                mostrarToast("La letra solo puede contener caracteres alfabéticos.", "error");
                return false;
            }
        }

        // Validación de teléfono permitiendo espacios
        const telefonoLimpio = telefono.replace(/\s+/g, ""); // Eliminar todos los espacios
        if (!/^\d{9}$/.test(telefonoLimpio)) {
            mostrarToast("El teléfono debe tener exactamente 9 dígitos numéricos.", "error");
            return false;
        }

        return true;
    };

    useEffect(() => {
        if (direccion) {
            const formatearTelefono = (numero) => {
                const soloDigitos = numero?.replace(/\D/g, "").slice(0, 9) || "";
                return soloDigitos
                    .replace(/^(\d{3})(\d{0,2})(\d{0,2})(\d{0,2}).*/, (_, a, b, c, d) =>
                        [a, b, c, d].filter(Boolean).join(" ")
                    );
            };

            setFormulario({
                nombre: direccion.nombre || "",
                apellido: direccion.apellido || "",
                telefono: formatearTelefono(direccion.telefono),
                pais: direccion.pais || "España",
                calle_avenida: direccion.calle_avenida || "",
                numero: direccion.numero || "",
                edificio: direccion.edificio || "",
                escalera: direccion.escalera || "",
                piso: direccion.piso || "",
                letra: direccion.letra || "",
                codigo_postal: direccion.codigo_postal || "",
                localidad: direccion.localidad || "",
                provincia: direccion.provincia || "",
                referencia: direccion.referencia || "",
            });

            setPredeterminada(direccion.predeterminada || false);
        }
        refrescarDirecciones();
    }, [direccion]);

    // Obtener otras direcciones predeterminadas distintas a la actual
    useEffect(() => {
        async function fetchRelaciones() {
            if (!user) return;
            const relaciones = await getUsuarioDireccionByUsuarioId(user.id);
            const otras = relaciones.filter(
                (rel) => rel.predeterminada && rel.id_direccion !== (direccion?.id_direccion ?? null)
            );
            setOtrasPredeterminadas(otras);
        }
        fetchRelaciones();
    }, [user]);

    // Esta función se encarga de guardar la dirección
    const refrescarDirecciones = async () => {
        if (!user) return;
        try {
            const relacionesActualizadas = await getUsuarioDireccionByUsuarioId(user.id);
            const otrasActualizadas = relacionesActualizadas.filter(
                (rel) => rel.predeterminada && rel.id_direccion !== (direccion?.id_direccion ?? null)
            );
            setOtrasPredeterminadas(otrasActualizadas);
        } catch (error) {
            console.error("Error al refrescar direcciones:", error);
        }
    };

    async function safeGetUsuarioDireccionByUsuarioId(userId) {
        try {
            const relaciones = await getUsuarioDireccionByUsuarioId(userId);
            return relaciones || [];
        } catch {
            return [];
        }
    }

    const modoEdicion = direccion && direccion.id_direccion;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarCampos() || !validarCamposExtra()) return;

        try {
            const relaciones = await safeGetUsuarioDireccionByUsuarioId(user.id);
            const esPrimeraDireccion = relaciones.length === 0;
            const marcarPredeterminada = predeterminada;

            const datosParaGuardar = {
                ...formulario,
                pais: "España",
                nombre: capitalize(formulario.nombre),
                apellido: capitalize(formulario.apellido),
                telefono: formulario.telefono.replace(/\s+/g, ""),
                piso: formulario.piso === '' ? null : formulario.piso,
                numero: formulario.numero === '' ? null : formulario.numero,
            };

            let idDireccion;

            if (modoEdicion) {
                // MODO EDICIÓN
                await updateDireccion(direccion.id_direccion, datosParaGuardar);
                idDireccion = direccion.id_direccion;

                // Actualizar relación usuario_direccion predeterminada si aplica
                const otras = relaciones.filter(rel => rel.predeterminada && rel.id_direccion !== direccion.id_direccion);
                for (const rel of otras) {
                    await updateUsuarioDireccion(rel.id, { predeterminada: false });
                }

                await updateUsuarioDireccion(
                    direccion.id,
                    { predeterminada }
                );

                await refrescarDirecciones();

                // SOLO si no hubo error, llamamos onSuccess para que el padre maneje el toast y cierre modal
                if (onSuccess) onSuccess();

            } else {
                // MODO CREACIÓN

                const datosParaGuardar = {
                    ...formulario,
                    nombre: capitalize(formulario.nombre),
                    apellido: capitalize(formulario.apellido),
                    telefono: formulario.telefono.replace(/\s+/g, ""),
                    piso: formulario.piso === '' ? null : formulario.piso,
                    numero: formulario.numero === '' ? null : formulario.numero,
                };

                const nuevaDireccion = await createDireccion(datosParaGuardar);
                idDireccion = nuevaDireccion.id;

                const nuevaRelacion = await createUsuarioDireccion({
                    id_usuario: user.id,
                    id_direccion: idDireccion,
                    predeterminada: marcarPredeterminada,
                });

                if (!esPrimeraDireccion && predeterminada) {
                    const otras = relaciones.filter(rel => rel.predeterminada && rel.id_direccion !== idDireccion);
                    for (const rel of otras) {
                        await updateUsuarioDireccion(rel.id, { predeterminada: false });
                    }
                }
                await refrescarDirecciones();

                // SOLO si no hubo error, llamamos onSuccess para que el padre maneje el toast y cierre modal
                if (onSuccess) onSuccess();

            }

            // Redirigir después de guardar
            setTimeout(() => {
                if (onSuccess) onSuccess();
                else navigate("/userProfile/direcciones");
            }, 1000);

        } catch (error) {
            console.error("Error al guardar la dirección:", error);
            mostrarToast("Hubo un error al guardar la dirección.", "error");
        }
    };


    return (
        <div>
            <h3 className="text-xl font-semibold mb-6">
                {modoEdicion ? "Editar dirección" : "Añadir nueva dirección"}
            </h3>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                {/* País */}
                <div>
                    <label htmlFor="pais" className="block mb-1 font-medium">País/Región</label>
                    <select
                        id="pais"
                        name="pais"
                        value={formulario.pais}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                    >
                        <option value="España">España</option>
                    </select>
                </div>

                {/* Nombre y Apellido en línea */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="nombre" className="block mb-1 font-medium">Nombre <span className="text-red-500">*</span></label>
                        <Input
                            id="nombre"
                            type="text"
                            name="nombre"
                            placeholder="Ej: Nombre"
                            value={formulario.nombre}
                            onChange={handleChange}
                            maxLength={50}
                            className=""
                        />
                    </div>

                    <div>
                        <label htmlFor="apellido" className="block mb-1 font-medium">Apellidos <span className="text-red-500">*</span></label>
                        <Input
                            id="apellido"
                            type="text"
                            name="apellido"
                            placeholder="Ej: Apellidos"
                            value={formulario.apellido}
                            onChange={handleChange}
                            maxLength={100}
                            className=""
                        />
                    </div>
                </div>

                {/* Teléfono */}
                <div>
                    <label htmlFor="telefono" className="block mb-1 font-medium">Teléfono <span className="text-red-500">*</span></label>
                    <Input
                        id="telefono"
                        type="tel"
                        name="telefono"
                        placeholder="Ej: 600 000 000"
                        value={formulario.telefono}
                        onChange={handleChange}
                        maxLength={25}
                        className=""
                    />
                </div>

                {/* Calle y Número en línea */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label htmlFor="calle_avenida" className="block mb-1 font-medium">Calle o Avenida <span className="text-red-500">*</span></label>
                        <Input
                            id="calle_avenida"
                            type="text"
                            name="calle_avenida"
                            placeholder="Ej: Calle Principal"
                            value={formulario.calle_avenida}
                            onChange={handleChange}
                            maxLength={250}
                            className=""
                        />
                    </div>
                    <div>
                        <label htmlFor="numero" className="block mb-1 font-medium">Número <span className="text-red-500">*</span></label>
                        <Input
                            id="numero"
                            type="number"
                            name="numero"
                            min="1"
                            max="9999"
                            placeholder="Ej: 1"
                            value={formulario.numero}
                            onChange={handleChange}
                            maxLength={10}
                            className=""
                        />
                    </div>
                </div>

                {/* Edificio, Escalera, Piso, Letra en línea */}
                <div className="grid grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="edificio" className="block mb-1 font-medium">Edificio</label>
                        <Input
                            id="edificio"
                            type="text"
                            name="edificio"
                            placeholder="Ej: Edf. A"
                            value={formulario.edificio}
                            onChange={handleChange}
                            maxLength={10}
                            className=""
                        />
                    </div>
                    <div>
                        <label htmlFor="escalera" className="block mb-1 font-medium">Escalera</label>
                        <Input
                            id="escalera"
                            type="text"
                            name="escalera"
                            placeholder="Ej: Esc. 1"
                            value={formulario.escalera}
                            onChange={handleChange}
                            maxLength={10}
                            className=""
                        />
                    </div>
                    <div>
                        <label htmlFor="piso" className="block mb-1 font-medium">Piso</label>
                        <Input
                            id="piso"
                            type="number"
                            name="piso"
                            min="0"
                            max="200"
                            placeholder="Ej: 3"
                            value={formulario.piso}
                            onChange={handleChange}
                            maxLength={10}
                            className=""
                        />
                    </div>
                    <div>
                        <label htmlFor="letra" className="block mb-1 font-medium">Letra</label>
                        <Input
                            id="letra"
                            type="text"
                            name="letra"
                            maxLength={1}
                            pattern="[A-Za-z]"
                            placeholder="Ej: B"
                            value={formulario.letra}
                            onChange={handleChange}
                            className=""
                        />
                    </div>
                </div>

                {/* Código Postal, Localidad y Provincia en línea */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="codigo_postal" className="block mb-1 font-medium">Código Postal <span className="text-red-500">*</span></label>
                        <Input
                            id="codigo_postal"
                            type="text"
                            name="codigo_postal"
                            placeholder="Ej: 28000"
                            value={formulario.codigo_postal}
                            onChange={handleChange}
                            maxLength={25}
                            className=""
                        />
                    </div>
                    <div>
                        <label htmlFor="localidad" className="block mb-1 font-medium">Localidad <span className="text-red-500">*</span></label>
                        <Input
                            id="localidad"
                            type="text"
                            name="localidad"
                            placeholder="Ej: Localidad"
                            value={formulario.localidad}
                            onChange={handleChange}
                            maxLength={100}
                            className=""
                        />
                    </div>
                    <div>
                        <label htmlFor="provincia" className="block mb-1 font-medium">Provincia <span className="text-red-500">*</span></label>
                        <Input
                            id="provincia"
                            type="text"
                            name="provincia"
                            placeholder="Ej: Provincia"
                            value={formulario.provincia}
                            onChange={handleChange}
                            maxLength={100}
                            className=""
                        />
                    </div>
                </div>

                {/* Referencia (textarea) */}
                <div>
                    <label htmlFor="referencia" className="block mb-1 font-medium">Referencia</label>
                    <textarea
                        id="referencia"
                        name="referencia"
                        placeholder="Ej: Cerca del parque, puerta azul"
                        value={formulario.referencia}
                        onChange={handleChange}
                        maxLength={250}
                        className="w-full border border-gray-300 p-2 rounded resize-none focus:outline-none focus:border-[#7912B0] focus:ring-0.5 focus:ring-[#7912B0]"
                        rows={3}
                    />
                </div>

                {/* Checkbox para predeterminada */}
                <div className="flex items-center space-x-2 mt-4">
                    <input
                        type="checkbox"
                        id="predeterminada"
                        checked={predeterminada}
                        onChange={(e) => setPredeterminada(e.target.checked)}
                        className="accent-[#7912B0] h-4 w-4 rounded border border-gray-300"
                    />
                    <label htmlFor="predeterminada" className="text-sm text-gray-700">
                        Establecer como dirección predeterminada
                    </label>
                </div>

                {/* Botones */}
                <div className="flex justify-between mt-4">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() =>
                            onCancel ? onCancel() : navigate("/userProfile/direcciones")
                        }
                    >
                        Cancelar
                    </Button>
                    <Button variant="purple" type="submit">
                        Guardar dirección
                    </Button>
                </div>

            </form>


            {toast.visible && (
                <Toast
                    mensaje={toast.mensaje}
                    tipo={toast.tipo}
                    onClose={() => setToast({ ...toast, visible: false })}
                />
            )}
        </div>
    );
}
