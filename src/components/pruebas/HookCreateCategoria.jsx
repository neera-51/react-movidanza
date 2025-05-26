import { useState } from "react";
import useCategoria from "../../hooks/useCategoria";  // Aquí cambiamos a singular

function PruebaCrearCategoria() {
  const { createCategoria } = useCategoria(); // Utilizamos el hook singular

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaPadre, setCategoriaPadre] = useState('');

  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert('El nombre es obligatorio.');
      return;
    }

    const nuevaCategoria = {
      nombre,
      descripcion,
      id_categoria_padre: categoriaPadre || null
    };

    try {
      const resultado = await createCategoria(nuevaCategoria);
      setMensaje(
        `Categoría creada:\nID: ${resultado.id}\nNombre: ${resultado.nombre}\nDescripción: ${resultado.descripcion ?? "Sin descripción"}`
      );
      setError(null);
      setNombre('');
      setDescripcion('');
      setCategoriaPadre('');
    } catch (err) {
      setError("Error al crear categoría");
      setMensaje(null);
    }
  };

  return (
    <>
      <h1>Crear una categoría</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre*:</label><br />
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Descripción:</label><br />
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div>
          <label>Categoría padre (ID):</label><br />
          <input
            type="number"
            value={categoriaPadre}
            onChange={(e) => setCategoriaPadre(e.target.value)}
          />
        </div>

        <button type="submit">Crear categoría</button>
      </form>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}

export default PruebaCrearCategoria;
