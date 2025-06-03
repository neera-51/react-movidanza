import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../../../hooks/api/useUserAuth';
import useMetodoPago from '../../../hooks/api/useMetodoPago';
import Toast from '../../../components/ui/Toast';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { capitalize } from "../../../utils/textUtils"

export default function FormularioMetodoPago({ onSuccess, onCancel, metodoPago = null }) {
    const { user } = useUser();
    const { createMetodoPago, updateMetodoPago, getMetodoPagoByIdUsuario } = useMetodoPago();
    const navigate = useNavigate();

    const [modoEdicion, setModoEdicion] = useState(false);

    const [form, setForm] = useState({
        tipo: 'tarjeta',
        token_pago: '',
        ultimos_digitos: '',
        fecha_vencimiento: '',
        cvv: '',
        tarjeta_tipo: '',
        nombre_titular: '',
        correo_asociado: '',
        predeterminada: false,
    });

    const [predeterminada, setPredeterminada] = useState(false);
    const [otrasPredeterminadas, setOtrasPredeterminadas] = useState([]);
    const [toast, setToast] = useState({ visible: false, mensaje: "", tipo: "success" });

    const mostrarToast = (mensaje, tipo = "success") => {
        setToast({ visible: true, mensaje, tipo });
    };

    useEffect(() => {
        if (metodoPago) {
            setModoEdicion(true);
            setForm({
                tipo: metodoPago.tipo || 'tarjeta',
                token_pago: metodoPago.token_pago || '',
                ultimos_digitos: metodoPago.ultimos_digitos || '',
                fecha_vencimiento: metodoPago.fecha_vencimiento ? metodoPago.fecha_vencimiento.slice(5, 7) + '-' + metodoPago.fecha_vencimiento.slice(2, 4) : '',
                cvv: '',
                tarjeta_tipo: metodoPago.tarjeta_tipo || '',
                nombre_titular: metodoPago.nombre_titular || '',
                correo_asociado: metodoPago.correo_asociado || '',
                predeterminada: metodoPago.predeterminada || false,
            });
            setPredeterminada(metodoPago.predeterminada || false);
        }
        refrescarMetodosPago();
    }, [metodoPago]);

    // Obtener otros métodos de pago predeterminados distintos al actual
    useEffect(() => {
        async function fetchMetodos() {
            if (!user) return;
            try {
                const metodos = await getMetodoPagoByIdUsuario(user.id);
                const otras = metodos.filter(
                    (m) => m.predeterminada && m.id !== (metodoPago?.id ?? null)
                );
                setOtrasPredeterminadas(otras);
            } catch (error) {
                console.error("Error al obtener métodos de pago:", error);
            }
        }
        fetchMetodos();
    }, [user, metodoPago]);

    // Esta función refresca los métodos de pago para actualizar estado
    const refrescarMetodosPago = async () => {
        if (!user) return;
        try {
            const metodos = await getMetodoPagoByIdUsuario(user.id);
            const otras = metodos.filter(
                (m) => m.predeterminada && m.id !== (metodoPago?.id ?? null)
            );
            setOtrasPredeterminadas(otras);
        } catch (error) {
            console.error("Error al refrescar métodos de pago:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let nuevoValor = value;
        if (name === 'nombre_titular') {
            if (/[^a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]/.test(value) || /\s{2,}/.test(value)) {
                return; // bloquea números, caracteres especiales y espacios dobles
            }
        }


        if (['cvv', 'ultimos_digitos'].includes(name)) {
            if (/[^\d]/.test(value)) return; // Solo números
        }

        if (['fecha_vencimiento'].includes(name)) {
            if (/[^\d-]/.test(value)) return; // Solo números (y guión en fecha)
        }

        if (name === 'token_pago') {
            nuevoValor = formatearTokenPago(value);
        }

        setForm({ ...form, [name]: type === 'checkbox' ? checked : nuevoValor });
    };


    const parseFechaVencimiento = (mmYY) => {
        if (!mmYY || !/^\d{2}-\d{2}$/.test(mmYY)) return null;
        const [mes, anioCorto] = mmYY.split('-');
        const anio = parseInt(anioCorto, 10) + 2000;
        return `${anio}-${mes}-01`; // YYYY-MM-01
    };

    const validarCampos = () => {
        const errores = [];

        if (!['tarjeta', 'paypal'].includes(form.tipo)) {
            errores.push('El tipo de método de pago debe ser "tarjeta" o "paypal".');
        }

        if (form.tipo === 'tarjeta') {
            // Validar nombre del titular
            const nombreRegex = /^([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)(\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]+){0,4}$/;
            if (!nombreRegex.test(form.nombre_titular.trim())) {
                errores.push('El nombre del titular debe contener solo letras y entre 1 y 5 palabras.');
            }

            // Validar fecha de vencimiento
            const fechaRegex = /^(0[1-9]|1[0-2])-(\d{2})$/;
            if (!fechaRegex.test(form.fecha_vencimiento)) {
                errores.push('La fecha de vencimiento debe estar en formato MM-YY (mes-año).');
            } else {
                const [mesStr, anioStr] = form.fecha_vencimiento.split('-');
                const anio = parseInt(anioStr, 10);
                const currentYear = new Date().getFullYear() % 100;
                if (anio < currentYear) {
                    errores.push('El año de vencimiento no puede ser menor al actual.');
                }
            }

            // Solo validar estos campos si NO estás en modo edición
            if (!modoEdicion) {
                // CVV
                if (!/^\d{3}$/.test(form.cvv)) {
                    errores.push('El CVV debe contener exactamente 3 dígitos numéricos.');
                }

                // token_pago
                const token = form.token_pago.replace(/\s+/g, '');
                if (!/^[A-Z]{2}\d{20}$/.test(token) && !/^[A-Z]{2}\d{22}$/.test(token)) {
                    errores.push('El número de tarjeta debe comenzar con 2 letras seguidas de 20 o 22 dígitos numéricos.');
                }

                // tipo tarjeta
                if (!['visa', 'mastercard'].includes(form.tarjeta_tipo.toLowerCase())) {
                    errores.push('El tipo de tarjeta debe ser Visa o Mastercard.');
                }
            }
        }

        if (form.tipo === 'paypal') {
            if (!form.correo_asociado || !/\S+@\S+\.\S+/.test(form.correo_asociado)) {
                errores.push('Debe proporcionar un correo electrónico válido para PayPal.');
            }
        }

        return errores;
    };



    const formatearTokenPago = (valor) => {
        const raw = valor.replace(/\s+/g, '').toUpperCase();

        const letras = raw.slice(0, 2).replace(/[^A-Z]/g, '');
        const numeros = raw.slice(2).replace(/\D/g, ''); // solo dígitos después de las letras

        const limpio = letras + numeros;
        const formatted = limpio.match(/.{1,4}/g)?.join(' ') || '';
        return formatted;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errores = validarCampos();
        if (errores.length > 0) {
            mostrarToast(errores[0], "error"); // Se pieden mostrar todos los errores si quiero
            return;
        }

        try {
            const metodos = await getMetodoPagoByIdUsuario(user.id);
            const marcarPredeterminada = form.predeterminada

            const datosParaGuardar = {
                ...form,
                id_usuario: user.id,
                nombre_titular: capitalize(form.nombre_titular),
            };

            if (form.tipo === 'tarjeta') {
                const fechaFormateada = parseFechaVencimiento(form.fecha_vencimiento);
                if (!fechaFormateada) {
                    mostrarToast('Fecha de vencimiento inválida. Usa el formato MM-YY (mes-año).', 'error');
                    return;
                }
                datosParaGuardar.fecha_vencimiento = fechaFormateada;
                datosParaGuardar.token_pago = form.token_pago.replace(/\s+/g, ''); // Sin espacios

                // Eliminar campos no relacionados con tarjeta
                delete datosParaGuardar.correo_asociado;
            } else {
                // Eliminar campos innecesarios para PayPal
                delete datosParaGuardar.fecha_vencimiento;
                delete datosParaGuardar.cvv;
                delete datosParaGuardar.token_pago;
                delete datosParaGuardar.nombre_titular;
                delete datosParaGuardar.tarjeta_tipo;
                delete datosParaGuardar.ultimos_digitos;
            }

            let idMetodo;

            if (modoEdicion && metodoPago?.id) {
                await updateMetodoPago(metodoPago.id, datosParaGuardar);
                idMetodo = metodoPago.id;
            } else {
                console.log("Formulario:", datosParaGuardar, marcarPredeterminada)
                const nuevoMetodo = await createMetodoPago({ ...datosParaGuardar, predeterminada: marcarPredeterminada });
                idMetodo = nuevoMetodo.id;
            }

            // Si se marcó como predeterminada, desmarcar las demás (excepto este método)
            if (form.predeterminada && metodos.length > 0) {
                const otros = metodos.filter(m => m.predeterminada && m.id !== idMetodo);
                for (const otro of otros) {
                    await updateMetodoPago(otro.id, { predeterminada: false });
                }
            }

            if (onSuccess) onSuccess();

        } catch (error) {
            console.error("Error al guardar método de pago:", error);
            mostrarToast("Hubo un error al guardar el método de pago.", "error");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                {!modoEdicion && (
                    <div>
                        <label htmlFor="tipo" className="block mb-1 font-medium">Método de pago</label>
                        <Select
                            id="tipo"
                            name="tipo"
                            value={form.tipo}
                            onChange={handleChange}
                            required
                            className="w-full"
                        >
                            <option value="" disabled>Selecciona un tipo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="paypal">PayPal</option>
                        </Select>
                    </div>
                )}

                {form.tipo === 'tarjeta' && (
                    <>
                        <div>
                            <label htmlFor="nombre_titular" className="block mb-1 font-medium">Nombre del titular</label>
                            <Input
                                id="nombre_titular"
                                name="nombre_titular"
                                placeholder="Como aparece en la tarjeta"
                                value={form.nombre_titular}
                                onChange={handleChange}
                                required
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="fecha_vencimiento" className="block mb-1 font-medium">Fecha de vencimiento (MM-YY)</label>
                            <Input
                                id="fecha_vencimiento"
                                name="fecha_vencimiento"
                                placeholder="MM-YY (mes-año)"
                                value={form.fecha_vencimiento}
                                onChange={handleChange}
                                required
                                maxLength={5}
                                className="w-full"
                            />
                        </div>

                        {!modoEdicion && (
                            <>
                                <div>
                                    <label htmlFor="cvv" className="block mb-1 font-medium">CVV</label>
                                    <Input
                                        id="cvv"
                                        name="cvv"
                                        placeholder="123"
                                        value={form.cvv}
                                        onChange={handleChange}
                                        required
                                        maxLength={3}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="token_pago" className="block mb-1 font-medium">Número de la tarjeta</label>
                                    <Input
                                        id="token_pago"
                                        name="token_pago"
                                        placeholder="ES00 0000 0000 0000 0000 0000"
                                        value={form.token_pago}
                                        onChange={handleChange}
                                        required
                                        maxLength={29} // 24 chars + 5 espacios = 29
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="tarjeta_tipo" className="block mb-1 font-medium">Tipo de tarjeta</label>
                                    <Select
                                        id="tarjeta_tipo"
                                        name="tarjeta_tipo"
                                        value={form.tarjeta_tipo}
                                        onChange={handleChange}
                                        required
                                        className="w-full"
                                    >
                                        <option value="" disabled>Selecciona el tipo</option>
                                        <option value="visa">Visa</option>
                                        <option value="mastercard">Mastercard</option>
                                    </Select>
                                </div>
                            </>
                        )}
                    </>
                )}

                {form.tipo === 'paypal' && (
                    <div>
                        <label htmlFor="correo_asociado" className="block mb-1 font-medium">Correo asociado a PayPal</label>
                        <Input
                            id="correo_asociado"
                            name="correo_asociado"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            value={form.correo_asociado}
                            onChange={handleChange}
                            required
                            className="w-full"
                        />
                    </div>
                )}


                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="predeterminada"
                        name="predeterminada"
                        checked={form.predeterminada}
                        onChange={handleChange}
                        className="h-4 w-4"
                    />
                    <label htmlFor="predeterminada" className="select-none">Establecer como predeterminada</label>
                </div>


                <div className="flex justify-between mt-4 ">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() =>
                            onCancel ? onCancel() : navigate("/userProfile/metodos_pago")
                        }
                    >
                        Cancelar
                    </Button>

                    <Button variant="purple" type="submit">
                        {modoEdicion ? 'Actualizar' : 'Agregar'}
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
        </>
    );
}
