import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm(); // Asegura que se complete la operación de confirmación
    onClose(); // Luego cierra el modal
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">Confirmación</h2>
        <div className="mt-4 mb-4">
          <p>{message}</p>
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 rounded text-gray-700 bg-gray-300 hover:bg-gray-400">
            Cancelar
          </button>
          <button onClick={handleConfirm} className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;