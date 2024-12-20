import React from 'react';
import { Link } from 'react-router-dom';
import { FiList, FiBarChart2, FiCalendar, FiUser, FiBook } from 'react-icons/fi';
import './styles.css';

const Sidebar = ({ activeRoute }) => {
  const menuItems = [
    { id: 'statistics', title: 'Estadísticas', icon: FiBarChart2, path: "/estadisticas" },
    { id: 'complaints', title: 'Lista de quejas', icon: FiList, path: "/lista" },
    { id: 'agenda', title: 'Agenda', icon: FiCalendar, path: "/agenda" },
    { id: 'workshop', title: 'Talleres', icon: FiBook, path: "/talleres" },
    { id: 'account', title: 'Cuenta', icon: FiUser, path: "/cuenta" },
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
              >
                <item.icon className="text-xl" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;