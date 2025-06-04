import { ShoppingCart, Search } from "lucide-react"
import { useState, useEffect } from "react"
import ProductoCard from "../../components/ProductoCard"
import useProducto from "../../hooks/api/useProducto"
import useCategoria from "../../hooks/api/useCategoria"
import useFiltrarProductos from "../../hooks/useFiltrarProductos"
import SidebarFiltros from "../../components/productos/SidebarFiltros"
import { capitalizeAndClean } from "../../utils/textUtils"

import { useUser } from "../../hooks/context/UserContext" // Para obtener el id del usuario
import useCarrito from "../../hooks/api/useCarrito" // Obtener el id del carrito
import useCarritoProducto from "../../hooks/api/useCarritoProducto" // Agregar porductos al carrito
import Toast from "../../components/ui/Toast"

export default function LayoutProductos() {
  const { getAllProductos, getProductosByCategoria } = useProducto()
  const { getAllCategorias, getCategoriasPadre, getCategoriasByIdPadre } = useCategoria()
  const { user, checking } = useUser()
  const { getCarritosByIdUsuario } = useCarrito()
  const { getCarritoProductoByIdCarrito, createCarritoProducto, updateCarritoProducto } = useCarritoProducto()

  // Estados principales
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriasPadre, setCategoriasPadre] = useState([])
  const [categoriasHijas, setCategoriasHijas] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // Estados para funcionalidad
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showAll, setShowAll] = useState(true) // Estado para la opción "Todas"
  const [searchTerm, setSearchTerm] = useState("")

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

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productosData, categoriasData, categoriasPadreData] = await Promise.all([
          getAllProductos(),
          getAllCategorias(),
          getCategoriasPadre(),
        ])

        setProductos(productosData)
        setCategorias(categoriasData)
        setCategoriasPadre(categoriasPadreData)

        const hijasPromises = categoriasPadreData.map((padre) => getCategoriasByIdPadre(padre.id))

        // Obtengo las catagorías hijas en paralelo
        const hijasResultados = await Promise.all(hijasPromises)

        const hijasMap = {}
        categoriasPadreData.forEach((padre, index) => {
          hijasMap[padre.id] = hijasResultados[index]
        })

        setCategoriasHijas(hijasMap)
      } catch (error) {
        setError(error)
        console.error("Error cargando datos:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

  // Filtrar y ordenar productos
  const filteredProducts = useFiltrarProductos({
    productos,
    searchTerm,
    selectedCategories,
    showAll,
    priceRange,
    sortBy,
  })

  if (loading) {
    return (
      <div className="pt-32 container mx-auto px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7912B0] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-32 container mx-auto px-4">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error al cargar los productos</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#7912B0] text-white px-4 py-2 rounded-lg hover:bg-[#6a0f9d] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div id="layout-productos" className="pt-20 min-h-screen">
      {/* Toast Component */}
      {toastState.visible && <Toast mensaje={toastState.mensaje} tipo={toastState.tipo} onClose={hideToast} />}

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Nuestros Productos</h1>
              <p className="text-gray-600 mt-1">Equipamiento y accesorios para pole dance</p>
            </div>

          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7912B0] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <SidebarFiltros
              categoriasPadre={categoriasPadre}
              categoriasHijas={categoriasHijas}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              showAll={showAll}
              setShowAll={setShowAll}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>

          {/* Products Grid - Siempre 3 columnas */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{filteredProducts.length} productos encontrados</span>
                {!showAll && selectedCategories.length > 0 && (
                  <span className="text-sm text-[#7912B0]">({selectedCategories.length} categorías seleccionadas)</span>
                )}
              </div>
            </div>

            {/* Grid fijo de 3 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((producto) => (
                <ProductoCard
                  key={producto.id}
                  producto={{
                    ...producto,
                    nombre: capitalizeAndClean(producto.nombre),
                  }}
                  onAgregar={() => handleAgregarAlCarrito(producto)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No se encontraron productos</h3>
                <p className="text-gray-500">Intenta ajustar los filtros o buscar con otros términos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}