import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom'; 
import "./styles.css";

const Header = () => {
  const navigate = useNavigate(); 
  const handleLogout = () => {
    navigate('/login'); 
  };
  return (
    <header className="bg-red-600 text-white p-2 flex justify-between items-center">
      {/* Contenedor para el logo y el título */}
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-20 w-28 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold">
          Sistema de Gestión de Casos de VBG
        </h1>
      </div>
      {/* Botón de cerrar sesión */}
      <button 
        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-2xl font-semibold"
        onClick={handleLogout} 
      >
        <span>Cerrar sesión</span>
        <FiLogOut size={24} />
      </button>
    </header>
  );
};

export default Header;