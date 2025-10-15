import React, { useState } from "react";
import { FiLogOut, FiChevronDown, FiUser } from "react-icons/fi";
import { useNavigate } from 'react-router-dom'; 
import "./styles.css";
import getCSRFToken from "../helpers/getCSRF";
import LoadingSpinner from "../components/LoadingSpinner";
import { baseURL } from "../api";

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutMessage("Cerrando sesión...");
    setShowMenu(false);
    
    try {
      const response = await fetch(`${baseURL}/logout/`, {
        method: "POST",
        credentials: "include", 
        headers: {
          "Authorization": `Token ${localStorage.getItem("userToken")}`,
          "X-CSRFToken": getCSRFToken(),
        },
      });

      if (response.ok) {
        setLogoutMessage("Sesión cerrada correctamente");
        
        // Pequeño delay para mostrar el mensaje de éxito
        setTimeout(() => {
          localStorage.clear();
          setIsLoggingOut(false);
          navigate("/login");
        }, 800);
      } else {
        setLogoutMessage("Error al cerrar sesión");
        setTimeout(() => {
          setIsLoggingOut(false);
        }, 1500);
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      setLogoutMessage("Error de conexión");
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 1500);
      console.error("Error en la conexión:", error);
    }
  };

  const toggleMenu = () => {
    if (!isLoggingOut) {
      setShowMenu(!showMenu);
    }
  };

  // Obtener nombre de usuario y rol
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  
  const getShortName = (name) => {
    if (!name) return 'Usuario';
    if (window.innerWidth < 768) {
      const names = name.split(' ');
      if (names.length > 1) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return name.length > 8 ? `${name.substring(0, 6)}..` : name;
    }
    return name;
  };

  return (
    <>
      {/* Spinner para cerrar sesión con mensaje dinámico */}
      {isLoggingOut && (
        <LoadingSpinner 
          message={logoutMessage}
          overlay={true}
          size="medium"
        />
      )}

      <header className="bg-red-600 text-white p-2 flex justify-between items-center relative z-50 shadow-md">
        {/* Logo y título */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-12 w-16 md:h-16 md:w-24 object-contain"
            />
          </div>
          <h1 className="text-lg md:text-2xl lg:text-3xl font-bold hidden sm:block">
            Sistema VBG
          </h1>
          <h1 className="text-sm font-bold sm:hidden">
            VBG
          </h1>
        </div>

        {/* Menú de usuario */}
        <div className="relative">
          <button 
            className={`flex items-center px-2 py-1 rounded text-sm md:text-base transition-all duration-200 ${
              isLoggingOut 
                ? 'bg-red-500 cursor-not-allowed opacity-90 scale-95' 
                : 'bg-red-600 hover:bg-red-700 hover:scale-105'
            }`}
            onClick={toggleMenu}
            disabled={isLoggingOut}
          >
            <div className="flex items-center space-x-1 md:space-x-2">
              {/* Icono de usuario o spinner */}
              {isLoggingOut ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiUser className="text-sm md:text-lg" />
              )}
              
              {/* Texto del usuario */}
              <span className="hidden xs:inline-block text-xs md:text-sm font-medium">
                {isLoggingOut ? 'Saliendo...' : getShortName(userName)}
              </span>
              
              {/* Rol - solo mostrar en desktop cuando no está haciendo logout */}
              {!isLoggingOut && (
                <span className="hidden md:inline-block text-xs opacity-90">
                  {userRole}
                </span>
              )}
              
              {/* Chevron solo cuando no está haciendo logout */}
              {!isLoggingOut && (
                <FiChevronDown className={`text-sm transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
              )}
            </div>
          </button>
          
          {/* Menú desplegable */}
          {showMenu && !isLoggingOut && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Información del usuario en el menú */}
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-medium text-gray-800 truncate">{userName}</p>
                <p className="text-xs text-gray-600">{userRole}</p>
              </div>
              
              <button 
                onClick={handleLogout} 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 w-full text-left transition-colors duration-200 group"
              >
                <FiLogOut size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

        {/* Overlay para cerrar menú cuando está abierto */}
        {showMenu && !isLoggingOut && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
        )}
      </header>
    </>
  );
};

export default Header;