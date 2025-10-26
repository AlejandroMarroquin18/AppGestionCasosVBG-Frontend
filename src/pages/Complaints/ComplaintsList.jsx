import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiDownload,
  FiFilter
} from "react-icons/fi";
import { getComplaints } from "../../api";
import LoadingSpinner from "../../components/LoadingSpinner";

const ComplaintsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplaints, setSelectedComplaints] = useState({});
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [complaintsPerPage] = useState(8);
  const [facultyFilter, setFacultyFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadComplaints = async () => {
      setIsLoading(true);
      try {
        const data = await getComplaints();
        const sortedData = data.sort((a, b) => a.id - b.id);
        setComplaints(sortedData);
      } catch (error) {
        console.error("Error getting data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComplaints();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [locationFilter, typeFilter, searchTerm, facultyFilter]);

  const filteredComplaints = complaints.filter((complaint) => {
    return (
      (locationFilter === "" ||
        (complaint.afectado_sede && complaint.afectado_sede.includes(locationFilter))) &&
      (typeFilter === "" ||
        (complaint.prioridad &&
          complaint.prioridad.includes(typeFilter))) &&
      (facultyFilter === "" ||
        (complaint.afectado_facultad && complaint.afectado_facultad.includes(facultyFilter))) &&
      (searchTerm === "" ||
        (complaint.afectado_codigo && complaint.afectado_codigo.toString().includes(searchTerm)) ||
        (complaint.afectado_nombre && complaint.afectado_nombre.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  });

  const lastPageIndex = currentPage * complaintsPerPage;
  const firstPageIndex = lastPageIndex - complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(firstPageIndex, lastPageIndex);
  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const toggleComplaintSelection = (id) => {
    setSelectedComplaints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleViewDetails = (id) => {
    navigate(`/quejas/detalles/${id}/`);
  };

  const handleDownloadCSV = () => {
    // Implementar descarga CSV
    alert("Función de descarga CSV próximamente");
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Aprobado': 'bg-green-100 text-green-800',
      'En Proceso': 'bg-blue-100 text-blue-800',
      'Finalizado': 'bg-gray-100 text-gray-800',
      'Remitido': 'bg-purple-100 text-purple-800'
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };


  const getPriorityBadge = (priority) => {
    const priorityColors = {
      'Muy Baja': 'bg-green-100 text-green-800',    // verde claro
      'Baja': 'bg-lime-100 text-lime-800',          // verde lima
      'Media': 'bg-yellow-100 text-yellow-800',     // amarillo
      'Alta': 'bg-orange-100 text-orange-800',      // naranja
      'Crítica': 'bg-red-100 text-red-800'          // rojo
    };
    
    return priorityColors[priority] || 'bg-gray-100 text-gray-800';
  };

  

    

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner message="Cargando quejas..." size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            📋 Lista de atenciones
          </h1>
          <p className="text-sm text-gray-600">
            {filteredComplaints.length} queja{filteredComplaints.length !== 1 ? 's' : ''} encontrada{filteredComplaints.length !== 1 ? 's' : ''}
          </p>
          <div className="w-16 h-1 bg-red-600 rounded-full mt-1"></div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
          {/* Search Bar - Más compacta */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar por código o nombre..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
              >
                <FiFilter size={14} />
                Filtros
              </button>
              
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                <FiDownload size={14} />
                Exportar
              </button>
            </div>
          </div>

          {/* Filters - Más compactos */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Sede
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todas las sedes</option>
                  <option value="Zarzal">Zarzal</option>
                  <option value="Melendez">Melendez</option>
                  <option value="Buga">Buga</option>
                  <option value="Santander">Santander</option>
                  <option value="Buenaventura">Buenaventura</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Prioridad
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todas las prioridades</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                  <option value="Crítica">Crítica</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Facultad
                </label>
                <select
                  value={facultyFilter}
                  onChange={(e) => setFacultyFilter(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todas las facultades</option>
                  <option value="Artes">Artes Integradas</option>
                  <option value="Ciencias Naturales">Ciencias Naturales</option>
                  <option value="Ciencias de la Administración">Administración</option>
                  <option value="Salud">Salud</option>
                  <option value="Ciencias Sociales">Ciencias Sociales</option>
                  <option value="Humanidades">Humanidades</option>
                  <option value="Ingeniería">Ingeniería</option>
                  <option value="Educación">Educación</option>
                  <option value="Psicología">Psicología</option>
                  <option value="Derecho">Derecho</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Sede
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Facultad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentComplaints.map((complaint) => (
                  <tr 
                    key={complaint.id}
                    className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                      selectedComplaints[complaint.id] ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => toggleComplaintSelection(complaint.id)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                      #{complaint.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                      {complaint.afectado_nombre || 'No especificado'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {complaint.afectado_sede || 'No especificado'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 font-mono">
                      {complaint.afectado_codigo || 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {complaint.afectado_facultad || 'No especificado'}
                    </td>
                    <td className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(complaint.prioridad)}`}>
                      {complaint.prioridad || 'No especificado'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {complaint.fecha_recepcion || 'No especificado'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(complaint.estado)}`}>
                        {complaint.estado || 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(complaint.id);
                        }}
                        className="text-white-600 hover:text-red-800 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                        title="Ver detalles"
                      >
                        <FiEye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {currentComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className={`border-b border-gray-200 p-3 hover:bg-gray-50 transition-colors duration-150 ${
                  selectedComplaints[complaint.id] ? 'bg-blue-50' : ''
                }`}
                onClick={() => toggleComplaintSelection(complaint.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {complaint.afectado_nombre || 'No especificado'}
                    </h3>
                    <p className="text-xs text-gray-600">ID: #{complaint.id}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(complaint.estado)}`}>
                    {complaint.estado || 'Pendiente'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 mb-2">
                  <div>
                    <span className="font-medium">Sede:</span> {complaint.afectado_sede || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Código:</span> {complaint.afectado_codigo || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Facultad:</span> {complaint.afectado_facultad || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Fecha:</span> {complaint.fecha_recepcion || 'N/A'}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    {complaint.prioridad || 'No especificado'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(complaint.id);
                    }}
                    className="text-white-600 hover:text-red-800 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                    title="Ver detalles"
                  >
                    <FiEye size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {currentComplaints.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📝</div>
              <h3 className="text-base font-medium text-gray-900 mb-1">
                No se encontraron quejas
              </h3>
              <p className="text-sm text-gray-500">
                {filteredComplaints.length === 0 && complaints.length > 0 
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No hay quejas registradas en el sistema"
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredComplaints.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
            <div className="text-xs text-gray-600">
              Mostrando {firstPageIndex + 1}-{Math.min(lastPageIndex, filteredComplaints.length)} de {filteredComplaints.length} quejas
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`p-1 rounded transition-all duration-200 flex items-center justify-center ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow'
                }`}
                style={{ width: "32px", height: "32px" }}
              >
                <FiChevronLeft size={16} />
              </button>
              
              <span className="px-3 py-1 text-xs font-medium text-gray-700">
                {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-1 rounded transition-all duration-200 flex items-center justify-center ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow'
                }`}
                style={{ width: "32px", height: "32px" }}
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsList;