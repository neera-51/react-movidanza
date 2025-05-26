// src/utils/api.js

import axios from 'axios';

/**
 * Instancia personalizada de Axios configurada con una URL base.
 *
 * Sirve para centralizar la configuración de las peticiones HTTP,
 * evitando repetir la URL del servidor en todo el proyecto y facilitando
 * futuras modificaciones o extensiones, como agregar headers o interceptores.
 */
const api = axios.create({ // crea una instancia personalizada de Axios, te da una copia de Axios con una configuración predefinida
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true // ⬅️ Clave para enviar cookies con las peticiones
});

/**
 * Exporta la instancia configurada para ser usada en cualquier parte del proyecto.
 *
 * Se recomienda usar esta instancia en lugar de axios directamente.
 */
export default api;