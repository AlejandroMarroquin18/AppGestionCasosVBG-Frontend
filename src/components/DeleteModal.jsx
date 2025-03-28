import React, { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title = "Eliminar",
}) => {
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
        <h2 className="text-lg font-bold text-red-600 mb-4 flex justify-center items-center">
          <FiTrash2 className="w-6 h-6 mr-2" />
          {title}
        </h2>
        <p className="text-center mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-150"
          >
            Confirmar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-lg transition-colors duration-150"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;