import React from "react";

const WarningModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h2 className="text-lg font-bold text-red-600 mb-4 flex justify-center items-center">
          {/* Icono de advertencia */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Advertencia
        </h2>
        <p className="text-center mb-6">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-150"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;