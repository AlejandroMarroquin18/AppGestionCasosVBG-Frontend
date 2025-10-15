import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiBarChart2, 
  FiList, 
  FiCalendar, 
  FiBook, 
  FiPlusSquare, 
  FiEye, 
  FiFolderPlus,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Cerrar sidebar móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Determinar si un menú está activo basado en la ruta actual
  const isMenuActive = (menuPath, submenuItems = []) => {
    const currentPath = location.pathname;
    
    // Verificar si la ruta actual coincide con el path del menú principal
    if (currentPath === menuPath) return true;
    
    // Verificar si la ruta actual coincide con algún submenú
    if (submenuItems.some(sub => currentPath === sub.path)) return true;
    
    // Verificar rutas parciales para submenús
    if (submenuItems.some(sub => currentPath.startsWith(sub.path))) return true;
    
    return false;
  };

  const handleMenuToggle = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems = [
    { 
      id: 'complaints', 
      title: 'Quejas', 
      icon: FiFolderPlus, 
      path: "/quejas",
      submenu: [
        { title: 'Estadísticas', path: '/quejas/estadisticas', icon: FiBarChart2 },
        { title: 'Lista de quejas', path: '/quejas/lista', icon: FiList },
      ]
    },
    {
      id: 'agenda', 
      title: 'Agenda', 
      icon: FiCalendar, 
      path: "/agenda",
      submenu: [
        { title: 'Estadísticas', path: '/agenda/estadisticas', icon: FiBarChart2 },
        { title: 'Citas', path: '/agenda/list', icon: FiCalendar },
      ]
    },
    {
      id: 'workshop', 
      title: 'Talleres', 
      icon: FiBook, 
      path: "/talleres",
      submenu: [
        { title: 'Estadísticas', path: '/talleres/estadisticas', icon: FiBarChart2 },
        { title: 'Crear taller', path: '/talleres/crear', icon: FiPlusSquare },
        { title: 'Ver talleres', path: '/talleres/ver', icon: FiEye },
      ]
    }
  ];

  const isSubmenuActive = (submenuItems) => {
    return submenuItems.some(sub => location.pathname === sub.path);
  };

  const SidebarContent = () => (
    <>
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Panel de Control</h1>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = isMenuActive(item.path, item.submenu);
            const isSubActive = isSubmenuActive(item.submenu);
            const isOpen = openMenus[item.id];

            return (
              <li key={item.id} className="relative">
                {/* Item del Menú Principal */}
                <div
                  className={`
                    flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 cursor-pointer
                    ${isActive ? 'bg-red-50 border-l-4 border-red-600 text-red-700' : 'text-gray-600 hover:bg-gray-50'}
                    ${isSubActive ? 'bg-red-50 text-red-700' : ''}
                  `}
                  onClick={() => handleMenuToggle(item.id)}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`text-lg ${isActive ? 'text-red-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  
                  {item.submenu && (
                    <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      <FiChevronDown className={`text-sm ${isActive ? 'text-red-600' : 'text-gray-400'}`} />
                    </div>
                  )}
                </div>

                {/* Submenú */}
                {item.submenu && isOpen && (
                  <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
                    {item.submenu.map((sub, index) => {
                      const isSubItemActive = location.pathname === sub.path;
                      
                      return (
                        <li key={index}>
                          <Link
                            to={sub.path}
                            className={`
                              flex items-center space-x-3 w-full p-2 rounded-lg transition-all duration-200
                              ${isSubItemActive 
                                ? 'bg-red-100 text-red-700 font-medium' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                              }
                            `}
                          >
                            <sub.icon className={`text-sm ${isSubItemActive ? 'text-red-600' : 'text-gray-400'}`} />
                            <span className="text-sm">{sub.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  return (
    <>
      {/* Botón Hamburguesa para Móvil */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-red rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
      </button>

      {/* Overlay para Móvil */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar para Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 bg-white border-r border-gray-200 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Sidebar para Móvil */}
      <aside className={`
        lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-300
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      {/* Espacio para el contenido principal (para desktop) */}
      <div className="lg:ml-64" />
    </>
  );
};

export default Sidebar;