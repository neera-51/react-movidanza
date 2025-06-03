import { useState, useEffect, useRef } from "react"
import { Filter, ChevronDown, ChevronRight } from "lucide-react"
import { capitalizeAndClean } from "../../utils/textUtils"


export default function SidebarFiltros({
    categoriasPadre,
    categoriasHijas,
    selectedCategories,
    setSelectedCategories,
    showAll,
    setShowAll,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
}) {
    const [expandedCategories, setExpandedCategories] = useState([])

    const toggleCategory = (categoryId) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
        )
    }

    const isParentFullySelected = (categoriaPadreId) => {
        const hijas = categoriasHijas[categoriaPadreId] || []

        if (hijas.length === 0) {
            // Si no tiene hijas, basta con que esté seleccionada
            return selectedCategories.includes(categoriaPadreId)
        }

        // Si tiene hijas, todas deben estar seleccionadas + el padre
        return (
            hijas.every((hija) => selectedCategories.includes(hija.id)) &&
            selectedCategories.includes(categoriaPadreId)
        )
    }


    const isParentPartiallySelected = (categoriaPadreId) => {
        const hijas = categoriasHijas[categoriaPadreId] || []
        const algunaHijaSeleccionada = hijas.some((hija) => selectedCategories.includes(hija.id))
        return algunaHijaSeleccionada && !isParentFullySelected(categoriaPadreId)
    }

    // Función para manejar selección de categorías con checkboxes
    const handleCategoryToggle = (categoryId, isParent = false) => {
        setSelectedCategories((prev) => {
            let newSelected = [...prev]

            if (showAll) setShowAll(false)

            if (isParent) {
                const categoriasHijasIds = categoriasHijas[categoryId]?.map((hija) => hija.id) || []

                if (prev.includes(categoryId)) {
                    newSelected = newSelected.filter((id) => id !== categoryId && !categoriasHijasIds.includes(id))
                } else {
                    newSelected = [...newSelected, categoryId, ...categoriasHijasIds]
                }
            } else {
                if (prev.includes(categoryId)) {
                    newSelected = newSelected.filter((id) => id !== categoryId)

                    const categoriaPadre = categoriasPadre.find((padre) =>
                        categoriasHijas[padre.id]?.some((hija) => hija.id === categoryId)
                    )

                    if (categoriaPadre) {
                        const hermanas = categoriasHijas[categoriaPadre.id] || []
                        const hermanasSeleccionadas = hermanas.filter(
                            (hermana) => newSelected.includes(hermana.id) && hermana.id !== categoryId
                        )

                        if (hermanasSeleccionadas.length === 0) {
                            newSelected = newSelected.filter((id) => id !== categoriaPadre.id)
                        }
                    }
                } else {
                    newSelected = [...newSelected, categoryId]

                    const categoriaPadre = categoriasPadre.find((padre) =>
                        categoriasHijas[padre.id]?.some((hija) => hija.id === categoryId)
                    )

                    if (categoriaPadre && !newSelected.includes(categoriaPadre.id)) {
                        newSelected = [...newSelected, categoriaPadre.id]
                    }
                }
            }

            if (newSelected.length === 0) setShowAll(true)

            return [...new Set(newSelected)]
        })
    }

    const handleToggleAll = () => {
        if (!showAll) {
            setShowAll(true)
            setSelectedCategories([])
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtros
            </h3>

            {/* Categorías */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700">Categorías</h4>
                    {selectedCategories.length > 0 && (
                        <button
                            onClick={() => {
                                setSelectedCategories([])
                                setShowAll(true)
                            }}
                            className="text-sm text-[#7912B0] hover:text-[#6a0f9d]"
                        >
                            Limpiar
                        </button>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="flex items-center cursor-pointer mb-2">
                        <input type="checkbox" checked={showAll} onChange={handleToggleAll} />
                        <span className="ml-2 font-medium text-gray-800">Todas</span>
                    </label>

                    <div className="border-t border-gray-200 my-2"></div>

                    {categoriasPadre.map((categoriaPadre) => (
                        <div key={`padre-${categoriaPadre.id}`} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isParentFullySelected(categoriaPadre.id)}
                                        ref={(el) => {
                                            if (el) {
                                                el.indeterminate = isParentPartiallySelected(categoriaPadre.id)
                                            }
                                        }}
                                        onChange={() => handleCategoryToggle(categoriaPadre.id, true)}
                                    />
                                    <span className="ml-2 font-medium text-gray-800">{capitalizeAndClean(categoriaPadre.nombre)}</span>
                                </label>
                                {categoriasHijas[categoriaPadre.id]?.length > 0 && (
                                    <button onClick={() => toggleCategory(categoriaPadre.id)}>
                                        {expandedCategories.includes(categoriaPadre.id) ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </button>
                                )}
                            </div>

                            {expandedCategories.includes(categoriaPadre.id) && (
                                <div className="ml-6 space-y-2">
                                    {categoriasHijas[categoriaPadre.id]?.map((hija) => (
                                        <label key={`hija-${hija.id}`} className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(hija.id)}
                                                onChange={() => handleCategoryToggle(hija.id)}
                                            />
                                            <span className="ml-2 text-gray-600">{capitalizeAndClean(hija.nombre)}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Precio */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Rango de precio</h4>
                <div className="flex items-center space-x-3">
                    <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
            </div>

            {/* Orden */}
            <div>
                <h4 className="font-medium text-gray-700 mb-3">Ordenar por</h4>
                <div className="space-y-2">
                    {[
                        { value: "newest", label: "Más recientes" },
                        { value: "price-low", label: "Precio: menor a mayor" },
                        { value: "price-high", label: "Precio: mayor a menor" },
                        { value: "name", label: "Nombre A-Z" },
                    ].map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className={`w-full text-left px-3 py-2 rounded ${sortBy === option.value ? "bg-[#7912B0] text-white" : "hover:bg-gray-100"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
