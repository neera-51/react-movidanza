import { Filter, Grid, List, ShoppingCart, Search } from "lucide-react"
import { useState, useEffect } from "react"
import ProductoCard from "../../components/ProductoCard"
import { ChevronDown, ChevronRight } from "lucide-react"
import useProducto from "../../hooks/useProducto"
import useCategoria from "../../hooks/useCategoria"

export default function LayoutProductos() {
  const { getAllProductos, getProductosByCategoria, getProductosByNombre } = useProducto()
  const { getAllCategorias, getCategoriasHijo, getCategoriaById, getCategoriasPadre, getCategoriasByIdPadre } = useCategoria()

  // Estados principales
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriasPadre, setCategoriasPadre] = useState([])
  const [categoriasHijas, setCategoriasHijas] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // Estados para funcionalidad
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState([])

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

        // Cargar categorías hijas para cada categoría padre
        const hijasMap = {}
        for (const categoriaPadre of categoriasPadreData) {
          const hijas = await getCategoriasByIdPadre(categoriaPadre.id)
          hijasMap[categoriaPadre.id] = hijas
        }
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

  // Función para alternar categorías expandidas
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // Función para manejar selección de categoría
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  // Filtrar y ordenar productos
  const filteredProducts = productos
    .filter((producto) => {
      const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())

      // Mejorar el filtro de categorías para incluir tanto padre como hijas
      let matchesCategory = selectedCategory === "all"
      if (!matchesCategory && selectedCategory !== "all") {
        // Si es una categoría padre, incluir todos sus productos hijos
        const categoriaPadre = categoriasPadre.find((cat) => cat.id === Number.parseInt(selectedCategory))
        if (categoriaPadre && categoriasHijas[categoriaPadre.id]) {
          const hijasIds = categoriasHijas[categoriaPadre.id].map((hija) => hija.id)
          matchesCategory = hijasIds.includes(producto.categoria_id)
        } else {
          // Si es una categoría hija, filtrar directamente
          matchesCategory = producto.categoria_id === Number.parseInt(selectedCategory)
        }
      }

      const precio = producto.descuento > 0 ? producto.precio * (1 - producto.descuento / 100) : producto.precio
      const matchesPrice = precio >= priceRange[0] && precio <= priceRange[1]
      return matchesSearch && matchesCategory && matchesPrice
    })
    .sort((a, b) => {
      const precioA = a.descuento > 0 ? a.precio * (1 - a.descuento / 100) : a.precio
      const precioB = b.descuento > 0 ? b.precio * (1 - b.descuento / 100) : b.precio

      switch (sortBy) {
        case "price-low":
          return precioA - precioB
        case "price-high":
          return precioB - precioA
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at)
        case "name":
          return a.nombre.localeCompare(b.nombre)
        default:
          return 0
      }
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
    <div id="layout-productos" className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Nuestros Productos</h1>
              <p className="text-gray-600 mt-1">Equipamiento y accesorios para pole dance</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Carrito:</span>
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-[#7912B0]" />
              </div>
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
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtros
              </h3>

              {/* Category Filter - Sin componentes inventados */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Categoría</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === "all"}
                      onChange={(e) => handleCategorySelect(e.target.value)}
                      className="text-[#7912B0] focus:ring-[#7912B0]"
                    />
                    <span className="ml-2 text-gray-700">Todas</span>
                  </label>

                  {categoriasPadre.map((categoriaPadre) => (
                    <div key={`padre-${categoriaPadre.id}`} className="space-y-2">
                      {/* Categoría Padre */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value={categoriaPadre.id.toString()}
                            checked={selectedCategory === categoriaPadre.id.toString()}
                            onChange={(e) => handleCategorySelect(e.target.value)}
                            className="text-[#7912B0] focus:ring-[#7912B0]"
                          />
                          <span className="ml-2 font-medium text-gray-800">{categoriaPadre.nombre}</span>
                        </label>
                        {categoriasHijas[categoriaPadre.id] && categoriasHijas[categoriaPadre.id].length > 0 && (
                          <button
                            onClick={() => toggleCategory(categoriaPadre.id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            {expandedCategories.includes(categoriaPadre.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Categorías Hijas - Sin Collapsible, solo con CSS */}
                      {expandedCategories.includes(categoriaPadre.id) && (
                        <div className="ml-6 space-y-2 transition-all duration-200">
                          {categoriasHijas[categoriaPadre.id]?.map((hija) => (
                            <label key={`hija-${hija.id}`} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="category"
                                value={hija.id.toString()}
                                checked={selectedCategory === hija.id.toString()}
                                onChange={(e) => handleCategorySelect(e.target.value)}
                                className="text-[#7912B0] focus:ring-[#7912B0]"
                              />
                              <span className="ml-2 text-gray-600">{hija.nombre}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Rango de precio</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7912B0]"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 1000])}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7912B0]"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    {priceRange[0]}€ - {priceRange[1]}€
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Ordenar por</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSortBy("newest")}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      sortBy === "newest" ? "bg-[#7912B0] text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    Más recientes
                  </button>
                  <button
                    onClick={() => setSortBy("price-low")}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      sortBy === "price-low" ? "bg-[#7912B0] text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    Precio: menor a mayor
                  </button>
                  <button
                    onClick={() => setSortBy("price-high")}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      sortBy === "price-high" ? "bg-[#7912B0] text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    Precio: mayor a menor
                  </button>
                  <button
                    onClick={() => setSortBy("name")}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      sortBy === "name" ? "bg-[#7912B0] text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    Nombre A-Z
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{filteredProducts.length} productos encontrados</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid" ? "bg-[#7912B0] text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list" ? "bg-[#7912B0] text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} />
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
