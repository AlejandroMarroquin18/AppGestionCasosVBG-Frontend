import React, { useState, useEffect } from "react";

const SuccessModal = ({ isOpen, onClose, message }) => {
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen) {
      setShowModal(true);
      timer = setTimeout(() => {
        setVisible(true);
      }, 10); 
    } else if (showModal) {
      setVisible(false);
      timer = setTimeout(() => {
        setShowModal(false);
      }, 300);
    }

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!showModal) return null;

  const modalClass = visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center transition-opacity duration-300">
      <div className={`bg-white rounded-lg shadow-xl p-6 max-w-sm w-full transition-all duration-300 ${modalClass}`}>
        <h2 className="text-lg font-bold text-green-600 mb-4 flex justify-center items-center">
          {/* Icono de éxito */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Éxito
        </h2>
        <p className="text-center mb-6">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-150"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
