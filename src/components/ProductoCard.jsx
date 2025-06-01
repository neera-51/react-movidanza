import { useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"

export default function ProductoCard({ producto, onViewDetails }) {
  const tieneDescuento = producto.descuento > 0
  const precioDescuento = tieneDescuento ? producto.precio * (1 - producto.descuento / 100) : producto.precio
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative ">
        <img
          src={producto.imagen_url || "/placeholder.svg"}
          alt={producto.nombre}
          className="w-full h-48 object-contain"
        />
        {tieneDescuento && (
          <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            -{producto.descuento}%
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{producto.nombre}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{producto.descripcion}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#7912B0]">
              {precioDescuento.toLocaleString("es-ES", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              €
            </span>
            {tieneDescuento && (
              <span className="text-lg text-gray-500 line-through">
                {producto.precio.toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                €
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {navigate(`/producto/${producto.id}`)}}
            className="flex-1 px-4 py-2 border border-[#7912B0] text-[#7912B0] rounded-lg hover:bg-purple-50 transition-colors text-center"
          >
            Ver detalles
          </button>
          

          <button
            className="px-4 py-2 bg-[#7912B0] text-white rounded-lg hover:bg-[#6a0f9d] transition-colors flex items-center"
            disabled={(producto.stock || 0) === 0}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
