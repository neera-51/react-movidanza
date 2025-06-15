import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Share2, ShoppingCart } from "lucide-react"
import useProducto from "../../hooks/api/useProducto"

import { useUser } from "../../hooks/context/UserContext" // Para obtener el id del usuario
import useCarrito from "../../hooks/api/useCarrito" // Obtener el id del carrito
import useCarritoProducto from "../../hooks/api/useCarritoProducto" // Agregar porductos al carrito
import Toast from "../../components/ui/Toast"
import { capitalizeAndClean } from "../../utils/textUtils"

export default function ProductoDetalle() {
    const { id } = useParams()
    const [producto, setProducto] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const { getProductoById } = useProducto()
    const { user, checking } = useUser()
    const { getCarritosByIdUsuario } = useCarrito()
    const { getCarritoProductoByIdCarrito, createCarritoProducto, updateCarritoProducto } = useCarritoProducto()

    // Estado para manejar Toast
    const [toastState, setToastState] = useState({
        visible: false,
        mensaje: "",
        tipo: "success",
    })

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

    useEffect(() => {

        const fetchData = async () => {
            try {
                const data = await getProductoById(id);
                setProducto(data);
                setLoading(false)
            } catch (err) {
                setError("No se pudo cargar la información.")
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    if (loading) {
        return <div>Cargando producto...</div>
    }

    // Si no hay producto, mostrar error
    if (!producto) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
                    <p className="text-gray-600">El producto que buscas no existe o ha sido eliminado.</p>
                </div>
            </div>
        )
    }
    const tieneDescuento = producto.descuento > 0
    const precioDescuento = tieneDescuento ? producto.precio * (1 - producto.descuento / 100) : producto.precio

    const handleAgregarAlCarrito = async (producto) => {
        try {
            if (checking) return;
            if (!user) {
                showToast("Debes iniciar sesión para agregar productos al carrito", "error")
                return
            }

            // 1. Obtener carrito del usuario
            const carritos = await getCarritosByIdUsuario(user.id)
            const carritoActual = carritos[0] // Asumiendo que hay uno solo

            if (!carritoActual) {
                showToast("No se encontró un carrito para este usuario", "error")
                return
            }

            // 2. Obtener si el producto ya está en el carrito
            const productosCarrito = await getCarritoProductoByIdCarrito(carritoActual.id)
            const existente = productosCarrito.find((cp) => cp.id_producto === producto.id)

            if (existente) {
                // 3. Si existe, verificar stock antes de sumar
                if (existente.cantidad >= producto.stock) {
                    showToast(`Stock agotado. Ya tienes ${existente.cantidad} en el carrito`, "error")
                    return
                }

                await updateCarritoProducto(existente.id, {
                    cantidad: existente.cantidad + 1,
                })
                showToast(`Ahora tienes ${existente.cantidad + 1} unidad${existente.cantidad + 1 > 1 ? 'es' : ''} en tu carrito`, "success")
            } else {
                // 4. Si no existe, crearlo
                if (producto.stock < 1) {
                    console.log("Este producto está fuera de stock", "error")
                    return
                }

                await createCarritoProducto({
                    id_carrito: carritoActual.id,
                    id_producto: producto.id,
                    cantidad: 1,
                })
                showToast(`${capitalizeAndClean(producto.nombre)} agregado al carrito`, "success")
            }

            setError(null) // Limpiar errores si todo va bien
        } catch (err) {
            console.error("Error al agregar al carrito:", err)
            showToast("Error al agregar el producto al carrito", "error")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Toast Component */}
            {toastState.visible && <Toast mensaje={toastState.mensaje} tipo={toastState.tipo} onClose={hideToast} />}
            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="overflow-hidden">
                    {/* Header del producto */}
                    <div className="px-6 py-6">
                        <h1 className="text-3xl font-bold text-gray-800">{producto.nombre}</h1>

                    </div>

                    <div className="p-6">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Imagen del producto */}
                            <div>
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                                    <img
                                        src={producto.imagen_url || "/placeholder.svg?height=500&width=500"}
                                        alt={producto.nombre}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* <div className="flex items-center space-x-4">
                                    <button className="flex items-center space-x-2 text-gray-600 hover:text-[#7912B0] transition-colors">
                                        <Share2 className="h-5 w-5" />
                                        <span>Compartir producto</span>
                                    </button>
                                </div> */}
                            </div>

                            {/* Información del producto */}
                            <div>
                                {/* Estado del stock y descuento */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-2">
                                        {tieneDescuento && (
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                -{producto.descuento}% OFF
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium">
                                        {(producto.stock || 0) > 10 ? (
                                            <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full">Disponible</span>
                                        ) : (producto.stock || 0) > 0 ? (
                                            <span className="text-orange-500 bg-orange-100 px-3 py-1 rounded-full">Pocas unidades</span>
                                        ) : (
                                            <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full">Agotado</span>
                                        )}
                                    </span>
                                </div>

                                {/* Precios */}
                                <div className="mb-8">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="text-4xl font-bold text-[#7912B0]">

                                            {precioDescuento.toLocaleString("es-ES", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}€
                                        </span>
                                        {tieneDescuento && (
                                            <span className="text-2xl text-gray-500 line-through">

                                                {producto.precio.toLocaleString("es-ES", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}€
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Descripción */}
                                <div className="mb-8">
                                    <h3 className="font-bold text-gray-800 mb-3 text-lg">Descripción</h3>
                                    <p className="text-gray-700 leading-relaxed">{producto.descripcion}</p>
                                </div>

                                {/* Detalles del producto */}
                                <div className="mb-8">
                                    <h3 className="font-bold text-gray-800 mb-4 text-lg">Detalles del producto</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <span className="text-sm text-gray-600">Categoría</span>
                                            <p className="font-medium">{producto.categoria?.nombre}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <span className="text-sm text-gray-600">Stock disponible</span>
                                            {producto.stock != null && (
                                                <p className="font-medium">
                                                    {console.log(producto.stock)}
                                                    {producto.stock === 0 ? 0 : producto.stock} unidades
                                                </p>
                                            )}

                                        </div>
                                        {producto.material && (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <span className="text-sm text-gray-600">Material</span>
                                                <p className="font-medium">{producto.material}</p>
                                            </div>
                                        )}
                                        {producto.color && (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <span className="text-sm text-gray-600">Color</span>
                                                <p className="font-medium">{producto.color}</p>
                                            </div>
                                        )}
                                        {producto.dimensiones && (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <span className="text-sm text-gray-600">Dimensiones</span>
                                                <p className="font-medium">{producto.dimensiones}</p>
                                            </div>
                                        )}
                                        {producto.peso && (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <span className="text-sm text-gray-600">Peso</span>
                                                <p className="font-medium">{producto.peso}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Botón de acción */}
                                {producto.stock <= 0 ? (
                                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 font-medium">Este producto está agotado</p>
                                    </div>
                                ) : (<div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        className="flex-1 bg-[#7912B0] text-white px-8 py-4 rounded-lg hover:bg-[#6a0f9d] transition-colors flex items-center justify-center space-x-2 font-medium"
                                        onClick={() => handleAgregarAlCarrito(producto)}
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        <span>Agregar al carrito</span>
                                    </button>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
