// hooks/useFiltrarProductos.js
export default function useFiltrarProductos({
  productos,
  searchTerm,
  selectedCategories,
  showAll,
  priceRange,
  sortBy,
}) {
  return productos
    .filter((producto) => {
      const nombreIncluye = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const perteneceCategoria = showAll || selectedCategories.includes(producto.id_categoria);
      const precio = producto.descuento > 0
        ? producto.precio * (1 - producto.descuento / 100)
        : producto.precio;
      const dentroRango = precio >= priceRange[0] && precio <= priceRange[1];

      return nombreIncluye && perteneceCategoria && dentroRango;
    })
    .sort((a, b) => {
      const precioA = a.descuento > 0 ? a.precio * (1 - a.descuento / 100) : a.precio;
      const precioB = b.descuento > 0 ? b.precio * (1 - b.descuento / 100) : b.precio;

      switch (sortBy) {
        case "price-low":
          return precioA - precioB;
        case "price-high":
          return precioB - precioA;
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "name":
          return a.nombre.localeCompare(b.nombre);
        default:
          return 0;
      }
    });
}
