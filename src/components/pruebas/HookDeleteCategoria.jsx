import { useState } from "react";
import useCategoria from "../../hooks/useCategoria";  // Cambiamos a singular

function PruebaEliminarCategoria() {
  const { deleteCategoria } = useCategoria();

  const [mensaje, setMensaje] = useState('');
  const [inputId, setInputId] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!inputId) {
      alert('Por favor introduce un ID');
      return;
    }

    try {
      await deleteCategoria(inputId);
      setMensaje(`Categoría con ID ${inputId} eliminada correctamente.`);
    } catch (error) {
      const mensajeError = error.response?.data?.error || "Error desconocido al eliminar la categoría.";
      setMensaje(`Error: ${mensajeError}`);
    }
  };

  return (
    <>
      <h1>Borrar una categoría por su ID</h1>

      <label>ID de la categoría</label>
      <input
        type="text"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
      />

      <button onClick={handleDelete}>
        Eliminar
      </button>

      {mensaje && <p>{mensaje}</p>}
    </>
  );
}

export default PruebaEliminarCategoria;
