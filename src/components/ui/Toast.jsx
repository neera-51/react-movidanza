import React, { useEffect, useRef } from "react";

export default function Toast({ mensaje, tipo = "success", onClose }) {
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    // Si es error dura 4 segundos, si es success 2.5 segundos
    const duration = tipo === "error" ? 4000 : 2500;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, tipo]);

  const styles = {
    success: "bg-green-100 text-green-800 border border-green-400",
    error: "bg-red-100 text-red-800 border border-red-400",
  };

  return (
    <div
      ref={ref}
      className={`fixed top-[calc(5rem+0.5rem)] left-1/2 -translate-x-1/2 transform px-6 py-3 rounded shadow cursor-pointer select-none ${styles[tipo]} z-11`}
      onClick={onClose}
      role="alert"
      aria-live="assertive"
      style={{ minWidth: "250px", textAlign: "center", fontWeight: "600" }}
    >
      {mensaje}
    </div>
  );
}
