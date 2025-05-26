import { useEffect, useState } from "react";
import useCategoria from "../../hooks/useCategoria";  // Cambiamos a singular

function PruebaObtenerCategoria() {
  const {
    getAllCategorias,
    getCategoriaById,
    getCategoriasPadre,
    getCategoriasHijo,
    getCategoriasByIdPadre,
  } = useCategoria();  // Utilizamos el hook singular

  const [categorias, setCategorias] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [categoriaEncontrada, setCategoriaEncontrada] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todas = await getAllCategorias();
        setCategorias(todas);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  const handleSearchIdChange = (event) => {
    setSearchId(event.target.value);
  };

  const handleBuscarCategoria = async () => {
    if (!searchId) {
      alert('Por favor, ingresa un ID para buscar.');
      return;
    }

    try {
      const categoria = await getCategoriaById(searchId);
      setCategoriaEncontrada(categoria);
    } catch (error) {
      setError(error);
      setCategoriaEncontrada(null);
    }
  };

  return (
    <>
      <h1>Mostrar todas las categorías</h1>
      {categorias.length > 0 ? (
        <ul>
          {categorias.map((categoria) => (
            <li key={categoria.id}>{categoria.nombre}</li>
          ))}
        </ul>
      ) : (
        <p>No hay categorías disponibles</p>
      )}

      <h1>Buscar categoría por ID</h1>
      <input
        type="number"
        value={searchId}
        onChange={handleSearchIdChange}
        placeholder="Ingrese el ID"
      />
      <button onClick={handleBuscarCategoria}>
        Buscar
      </button>

      {error && <p>Error al buscar: {error.message}</p>}
      {categoriaEncontrada && (
        <div>
          <h3>Categoría Encontrada:</h3>
          <p>ID: {categoriaEncontrada.id}</p>
          <p>Nombre: {categoriaEncontrada.nombre}</p>
        </div>
      )}
    </>
  );
}

export default PruebaObtenerCategoria;
