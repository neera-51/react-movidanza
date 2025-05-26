export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col relative">
        {/* Botón sticky arriba */}
        <button
          onClick={onClose}
          className="sticky top-2 self-end mr-2 mt-2 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1 z-10"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Contenido con scroll */}
        <div className="overflow-y-auto px-6 pb-6" style={{ maxHeight: 'calc(80vh - 40px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
