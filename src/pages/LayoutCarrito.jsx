// Importando los hooks que ya tienes en tu proyecto
import { useUser } from "../hooks/context/UserContext"
import useCarrito from "../hooks/api/useCarrito"
import useCarritoProducto from "../hooks/api/useCarritoProducto"
import useProducto from "../hooks/api/useProducto"
import Toast from "../components/ui/Toast"
import { capitalizeAndClean } from "../utils/textUtils"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { ShoppingCart, Trash2, Minus, Plus, X } from "lucide-react"
import ConfirmDialog from "../components/ui/ConfirmDialog"


export default function LayoutCarrito() {
    // Usando tus hooks existentes
    const { user, checking } = useUser()
    const { getCarritosByIdUsuario } = useCarrito()
    const {
        getCarritoProductoByIdCarrito,
        updateCarritoProducto,
        deleteCarritoProducto,
        deleteCarritoProductosByIdCarrito,
    } = useCarritoProducto()
    const { getProductoById } = useProducto()

    const navigate = useNavigate()

    // Estados
    const [carritoProductos, setCarritoProductos] = useState([])
    const [carrito, setCarrito] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Estado para manejar Toast (igual que en tu código)
    const [toastState, setToastState] = useState({
        visible: false,
        mensaje: "",
        tipo: "success",
    })

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState({
        title: "",
        description: "",
        onConfirm: () => { },
        color: "purple",
    });

    const mostrarConfirmacion = ({ title, description, onConfirm, color = "red" }) => {
        setDialogConfig({ title, description, onConfirm, color });
        setDialogOpen(true);
    };

    const showToast = (msg, tipo = "success") => {
        setToastState({
            visible: true,
            mensaje: msg,
            tipo: tipo,
        })
    }

    const hideToast = () => {
        setToastState((prev) => ({
            ...prev,
            visible: false,
        }))
    }

    const fetchCarritoData = async () => {
        setLoading(true) // Mostrar el spinner de carga
        try {
            if (!user) {
                setError("Debes iniciar sesión para ver tu carrito")
                setLoading(false)
                return
            }

            setLoading(true)

            // 1. Obtener carrito del usuario (igual que en tu código)
            const carritos = await getCarritosByIdUsuario(user.id)
            const carritoActual = carritos[0] // Asumiendo que hay uno solo

            if (!carritoActual) {
                setError("No se encontró un carrito para este usuario")
                setLoading(false)
                return
            }

            setCarrito(carritoActual)

            // 2. Obtener productos del carrito
            const productosCarrito = await getCarritoProductoByIdCarrito(carritoActual.id)

            // 3. Enriquecer con datos completos del producto
            const productosEnriquecidos = await Promise.all(
                productosCarrito.map(async (cp) => {
                    const productoCompleto = await getProductoById(cp.id_producto)
                    return {
                        ...cp,
                        producto: productoCompleto,
                    }
                }),
            )

            setCarritoProductos(productosEnriquecidos)
        } catch (err) {
            console.error("Error al cargar el carrito:", err)
            setError("Error al cargar los productos del carrito")
            showToast("Error al cargar el carrito", "error")
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (!checking) {
            fetchCarritoData()
        }
    }, [checking, user])


    // Aumentar cantidad (usando tu lógica)
    const handleAumentarCantidad = async (carritoProducto) => {
        try {
            const producto = carritoProducto.producto

            // Verificar stock (igual que en tu código)
            if (carritoProducto.cantidad >= producto.stock) {
                showToast(`Stock agotado. Ya tienes ${carritoProducto.cantidad} en el carrito`, "error")
                return
            }

            const nuevaCantidad = carritoProducto.cantidad + 1

            // Usar tu método updateCarritoProducto
            await updateCarritoProducto(carritoProducto.id, {
                cantidad: nuevaCantidad,
            })

            // Actualizar estado local
            setCarritoProductos((prev) =>
                prev.map((cp) => (cp.id === carritoProducto.id ? { ...cp, cantidad: nuevaCantidad } : cp)),
            )

        } catch (err) {
            console.error("Error al aumentar cantidad:", err)
            showToast("Error al actualizar la cantidad", "error")
        }
    }

    // Disminuir cantidad
    const handleDisminuirCantidad = async (carritoProducto) => {
        try {
            if (!carritoProducto || !carritoProducto.producto) {
                showToast("Producto inválido", "error")
                return
            }

            if (carritoProducto.cantidad <= 1) {
                // Solo delega la eliminación, no repitas confirmación aquí
                handleEliminarProducto(carritoProducto)
                return
            }

            const nuevaCantidad = carritoProducto.cantidad - 1

            await updateCarritoProducto(carritoProducto.id, {
                cantidad: nuevaCantidad,
            })

            setCarritoProductos((prev) =>
                prev.map((cp) =>
                    cp.id === carritoProducto.id
                        ? { ...cp, cantidad: nuevaCantidad }
                        : cp
                )
            )

        } catch (err) {
            console.error("Error al disminuir cantidad:", err)
            showToast("Error al actualizar la cantidad", "error")
        }
    }


    // Eliminar producto específico
    const handleEliminarProducto = (carritoProducto) => {
        if (!carritoProducto || !carritoProducto.producto) {
            showToast("Producto inválido", "error")
            return
        }

        const nombreProducto = capitalizeAndClean(carritoProducto.producto.nombre || "el producto")

        mostrarConfirmacion({
            title: `Eliminar`,
            description: `¿Está seguro que desea eliminar "${nombreProducto}" del carrito?`,
            onConfirm: async () => {
                try {
                    await deleteCarritoProducto(carritoProducto.id)

                    setCarritoProductos((prev) =>
                        prev.filter((cp) => cp.id !== carritoProducto.id)
                    )

                    showToast(`"${nombreProducto}" eliminado del carrito`, "success")
                } catch (err) {
                    console.error("Error al eliminar producto:", err)
                    showToast("Error al eliminar el producto", "error")
                } finally {
                    setDialogOpen(false)
                }
            },
            color: "red", // o el que prefieras
        })
    }


    // Vaciar carrito completo
    const handleVaciarCarrito = async () => {
        try {
            if (!carrito) return

            await deleteCarritoProductosByIdCarrito(carrito.id)

            setCarritoProductos([])
            showToast("Carrito vaciado correctamente", "success")
        } catch (err) {
            console.error("Error al vaciar carrito:", err)
            showToast("Error al vaciar el carrito", "error")
        }
    }

    // Calcular total
    const calcularTotal = () => {
        return carritoProductos
            .reduce((total, cp) => {
                const tieneDescuento = cp.producto.descuento > 0;
                const precioFinal = tieneDescuento
                    ? cp.producto.precio * (1 - cp.producto.descuento / 100)
                    : cp.producto.precio;

                return total + precioFinal * cp.cantidad;
            }, 0)
            .toFixed(2);
    }

    const calcularTotalItems = () => {
        return carritoProductos.reduce((total, cp) => total + cp.cantidad, 0)
    }

    // Loading state (igual que en tu código)
    if (checking || loading) {
        return (
            <div className="pt-32 container mx-auto px-4">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7912B0] mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando carrito...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Error state (igual que en tu código)
    if (error) {
        return (
            <div className="pt-32 container mx-auto px-4">
                <div className="text-center py-12">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => {
                            setLoading(true);        // Mostrar la pantalla de "Cargando carrito..."
                            setError(null);
                            fetchCarritoData()
                        }}
                        className="bg-[#7912B0] text-white px-4 py-2 rounded-lg hover:bg-[#6a0f9d] transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="pt-20 min-h-screen bg-white/20">
            {/* Toast Component */}
            {toastState.visible && <Toast mensaje={toastState.mensaje} tipo={toastState.tipo} onClose={hideToast} />}

            <div className="container mx-auto px-4 py-4 sm:py-8">
                {/* Header - Responsive */}
                <div className="bg-white shadow-sm rounded-lg mb-6">
                    <div className="px-4 sm:px-6 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-5">
                                <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-[#7912B0] flex-shrink-0" />
                                <div className="min-w-0">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Mi Carrito</h1>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        {calcularTotalItems()} {calcularTotalItems() === 1 ? "producto" : "productos"} en tu carrito
                                    </p>
                                </div>
                            </div>

                            {carritoProductos.length > 0 && (
                                <button
                                    onClick={handleVaciarCarrito}
                                    className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 text-sm sm:text-base text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors w-full sm:w-auto"
                                >
                                    <Trash2 className="h-4 w-4 flex-shrink-0" />
                                    <span className="whitespace-nowrap">Vaciar Carrito</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {carritoProductos.length === 0 ? (
                    // Carrito vacío
                    <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center mx-auto max-w-md">
                        <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">Tu carrito está vacío</h3>
                        <p className="text-sm sm:text-base text-gray-500 mb-6">Agrega algunos productos para comenzar</p>
                        <button
                            onClick={() => navigate("/productos")}
                            className="bg-[#7912B0] text-white px-6 py-3 rounded-lg hover:bg-[#6a0f9d] transition-colors w-full sm:w-auto"
                        >
                            Explorar Productos
                        </button>
                    </div>
                ) : (
                    // Carrito con productos - Layout responsive
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                        {/* Lista de productos */}
                        <div className="xl:col-span-2 space-y-4">
                            {carritoProductos.map((carritoProducto) => (
                                <div key={carritoProducto.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                                    {/* Layout móvil: Stack vertical */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        {/* Imagen del producto */}
                                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                                            <img
                                                src={carritoProducto.producto.imagen_url || "/placeholder.svg?height=100&width=100"}
                                                alt={carritoProducto.producto.nombre}
                                                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Información del producto */}
                                        <div className="flex-1 text-center sm:text-left max-w-full overflow-hidden">
                                            <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-2">
                                                {capitalizeAndClean(carritoProducto.producto.nombre)}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2 break-words overflow-hidden">
                                                {carritoProducto.producto.descripcion}
                                            </p>

                                            <div className="flex items-center justify-center sm:justify-start space-x-2">
                                                <span className="text-xl sm:text-2xl font-bold text-[#7912B0]">
                                                    {(carritoProducto.producto.descuento > 0
                                                        ? carritoProducto.producto.precio * (1 - carritoProducto.producto.descuento / 100)
                                                        : carritoProducto.producto.precio
                                                    ).toFixed(2)}€</span>

                                                {carritoProducto.producto.descuento > 0 && (
                                                    <>
                                                        <span className="text-lg text-gray-500 line-through">
                                                            {carritoProducto.producto.precio.toFixed(2)}€
                                                        </span>
                                                        <span className="text-xs font-semibold bg-red-500 text-white px-2 py-0.5 rounded-full">
                                                            -{carritoProducto.producto.descuento}%
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>


                                        {/* Controles y acciones - Layout responsive */}
                                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                            {/* Controles de cantidad */}
                                            <div className="flex items-center gap-3 order-2 sm:order-1">
                                                <button
                                                    onClick={() => handleDisminuirCantidad(carritoProducto)}
                                                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </button>

                                                <span className="font-semibold text-lg min-w-[2rem] text-center">
                                                    {carritoProducto.cantidad}
                                                </span>

                                                <button
                                                    onClick={() => handleAumentarCantidad(carritoProducto)}
                                                    disabled={carritoProducto.cantidad >= carritoProducto.producto.stock}
                                                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </button>
                                            </div>

                                            {/* Subtotal y eliminar */}
                                            <div className="text-center sm:text-right order-1 sm:order-2">
                                                <p className="text-lg sm:text-xl font-bold mb-2">
                                                    {(
                                                        (carritoProducto.producto.descuento > 0
                                                            ? carritoProducto.producto.precio * (1 - carritoProducto.producto.descuento / 100)
                                                            : carritoProducto.producto.precio
                                                        ) * carritoProducto.cantidad
                                                    ).toFixed(2)}€
                                                </p>
                                                <button
                                                    onClick={() => handleEliminarProducto(carritoProducto)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen del pedido - Responsive */}
                        <div className="xl:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 xl:sticky xl:top-4">
                                <h2 className="text-lg sm:text-xl font-bold mb-4">Resumen del Pedido</h2>

                                {/* Lista de productos en el resumen */}
                                <div className="space-y-2 mb-4 max-h-40 sm:max-h-60 overflow-y-auto">
                                    {carritoProductos.map((cp) => {
                                        const tieneDescuento = cp.producto.descuento > 0;
                                        const precioFinal = tieneDescuento
                                            ? cp.producto.precio * (1 - cp.producto.descuento / 100)
                                            : cp.producto.precio;

                                        return (
                                            <div key={cp.id} className="flex justify-between text-m gap-2">
                                                <span className="truncate flex-1">
                                                    {capitalizeAndClean(cp.producto.nombre)} x{cp.cantidad}
                                                </span>
                                                <span className="font-medium flex-shrink-0">
                                                    {(precioFinal * cp.cantidad).toFixed(2)}€
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>


                                <hr className="my-4" />

                                <div className="flex justify-between items-center text-base sm:text-lg font-bold mb-6">
                                    <span>Total:</span>
                                    <span className="text-[#7912B0]">{calcularTotal()}€</span>
                                </div>

                                {/* Botones de acción */}
                                <div className="space-y-3">
                                    <button className="w-full bg-[#7912B0] text-white py-3 rounded-lg hover:bg-[#6a0f9d] transition-colors text-sm sm:text-base font-medium">
                                        Finalizar Compra
                                    </button>

                                    <button
                                        onClick={() => navigate("/productos")}
                                        className="w-full border border-[#7912B0] text-[#7912B0] py-3 rounded-lg hover:bg-[#7912B0] hover:text-white transition-colors text-sm sm:text-base font-medium"
                                    >
                                        Seguir Comprando
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={dialogOpen}
                title={dialogConfig.title}
                description={dialogConfig.description}
                onCancel={() => setDialogOpen(false)}
                onConfirm={dialogConfig.onConfirm}
                color={dialogConfig.color}
            />
        </div>
    )
}