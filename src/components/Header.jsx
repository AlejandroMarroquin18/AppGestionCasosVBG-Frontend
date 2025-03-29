import React, { useState } from "react";
import { FiLogOut, FiChevronDown } from "react-icons/fi";
import { useNavigate } from 'react-router-dom'; 
import "./styles.css";
import getCSRFToken from "../helpers/getCSRF";





const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout/", {
        
          method: "POST",
          credentials: "include", // 🔥 Necesario para eliminar cookies de sesión
          headers: {
            "X-CSRFToken": getCSRFToken(), // 🔥 Envía el token CSRF
          },
          
      });

      if (response.ok) {
          localStorage.clear(); // ✅ Borra los datos locales
          navigate("/login"); // ✅ Redirige a la pantalla de login
      } else {
          console.error("Error al cerrar sesión");
      }
    } catch (error) {
        console.error("Error en la conexión:", error);
    }

  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="bg-red-600 text-white p-2 flex justify-between items-center" style={{ zIndex: 1000 }}>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-20 w-28 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold">
          Sistema del Área de atención de VBG
        </h1>
      </div>
      <div className="relative">
        <button className="flex flex-col items-center bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-2xl font-semibold"
                onClick={toggleMenu}>
          <span>{localStorage.getItem('userName')}</span>
          <span className="text-sm">{localStorage.getItem('userRole')}</span>
          <FiChevronDown size={24} />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl text-black"
               style={{ zIndex: 1050, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button onClick={handleLogout} className="px-4 py-2 text-sm text-gray-700 hover:bg-red-100 w-full text-center">
              Cerrar sesión
              <FiLogOut size={16} className="inline-block ml-2" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
