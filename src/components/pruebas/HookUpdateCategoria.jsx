import { useState } from "react";
import useCategoria from "../../hooks/useCategoria";  // Cambiamos a singular

function PruebaActualizarCategoria() {
  const { updateCategoria } = useCategoria();

  const [categoriaActualizada, setCategoriaActualizada] = useState({});
  const [inputId, setInputId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    // Extrae el nombre del campo y su valor actual del input
    const { name, value } = e.target;

    // Actualiza el estado 'categoriaActualizada'
    // 'prev' representa el valor anterior del estado antes de actualizarlo
    setCategoriaActualizada(prev => ({
      ...prev,              // Copia todas las propiedades anteriores del estado
      [name]: value         // Sobrescribe (o agrega) el valor del campo que se está modificando
    }));
  };


  const handleUpdate = async () => {
    if (!inputId) {
      alert('Introduce el ID de la categoría a actualizar');
      return;
    }

    setLoading(true);
    setError('');
    setMensaje('');

    try {
      const datosAEnviar = Object.fromEntries(
        // Convertimos el objeto en un array de pares [clave, valor]
        Object.entries(categoriaActualizada)
          // Filtramos solo los pares cuyo valor no sea una cadena vacía
          .filter(([_, v]) => v !== '') // Ignoramos la clave (_) y usamos solo el valor (v)
      );


      const resultado = await updateCategoria(inputId, datosAEnviar);
      setMensaje(`Categoría actualizada con éxito:\n${JSON.stringify(resultado, null, 2)}`);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Error al actualizar';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Actualizar una categoría</h1>

      <label>ID de la categoría*</label>
      <input
        type="text"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
        placeholder="ID a actualizar"
      />

      <label>Nuevo nombre</label>
      <input
        type="text"
        name="nombre"
        value={categoriaActualizada.nombre || ''}
        onChange={handleChange}
      />

      <label>Nueva descripción</label>
      <input
        type="text"
        name="descripcion"
        value={categoriaActualizada.descripcion || ''}
        onChange={handleChange}
      />

      <label>ID de la categoría padre (opcional)</label>
      <input
        type="text"
        name="id_categoria_padre"
        value={categoriaActualizada.id_categoria_padre || ''}
        onChange={handleChange}
      />

      <button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Actualizando...' : 'Actualizar'}
      </button>

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      {mensaje && <pre style={{ background: '#eee', padding: '1em' }}>{mensaje}</pre>}
    </>
  );
}

export default PruebaActualizarCategoria;
