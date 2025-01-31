import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiList, FiCalendar, FiBook, FiPlusSquare, FiEye, FiFolderPlus } from 'react-icons/fi';
import './styles.css';

const Sidebar = ({ activeRoute }) => {
  const [open, setOpen] = useState('');

  const handleToggle = (id, event) => {
    // Prevenir redirección si hay un submenú
    if (event) {
      event.preventDefault(); // Evita que el enlace redirija
    }
    if (open === id) {
      setOpen('');
    } else {
      setOpen(id);
    }
  };

  const menuItems = [
    { id: 'statistics', title: 'Estadísticas', icon: FiBarChart2, path: "/estadisticas" },
    { 
      id: 'complaints', 
      title: 'Quejas', 
      icon: FiFolderPlus, 
      path: "/quejas",
      submenu: [
        { title: 'Lista de quejas', path: '/quejas/lista', icon: FiList },
        { title: 'Estadísticas', path: '/quejas/estadisticas', icon: FiBarChart2 },
      ]
    },
    {
      id: 'agenda', 
      title: 'Agenda', 
      icon: FiCalendar, 
      path: "/agenda",
      submenu: [
        { title: 'Citas', path: '/agenda/list', icon: FiCalendar },
        { title: 'Estadísticas', path: '/agenda/estadisticas', icon: FiBarChart2 },
      ]
    },
    {
      id: 'workshop', 
      title: 'Talleres', 
      icon: FiBook, 
      path: "/talleres",
      submenu: [
        { title: 'Crear taller', path: '/talleres/crear', icon: FiPlusSquare },
        { title: 'Ver talleres', path: '/talleres/ver', icon: FiEye },
        { title: 'Estadísticas', path: '/talleres/estadisticas', icon: FiBarChart2 }
      ]
    }
  ];

  return (
    <aside className="bg-gray-100 w-64 min-h-screen p-4 text-lg">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center space-x-2 w-full p-2 rounded ${
                  activeRoute === item.id ? 'bg-white text-red-600 shadow' : 'text-gray-600 hover:bg-white'
                }`}
                onClick={(e) => handleToggle(item.id, item.submenu ? e : null)}
              >
                <item.icon className="text-xl" />
                <span>{item.title}</span>
              </Link>
              {open === item.id && item.submenu && (
                <ul className="ml-4">
                  {item.submenu.map((sub, index) => (
                    <li key={index} className="mt-1">
                      <Link
                        to={sub.path}
                        className="flex items-center space-x-2 w-full p-1 text-gray-600 hover:text-red-600 hover:bg-white rounded"
                      >
                        <sub.icon className="text-lg" />
                        <span>{sub.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;