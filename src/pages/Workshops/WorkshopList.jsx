import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiTrash2, FiEye, FiFilter, FiDownload, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getWorkshops, deleteWorkshop } from "../../api";
import DeleteModal from "../../components/DeleteModal";
import LoadingSpinner from "../../components/LoadingSpinner";

const WorkshopList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [workshops, setWorkshops] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [modalityFilter, setModalityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);
  const [modalMessage, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [workshopsPerPage] = useState(8);

  useEffect(() => {
    const loadWorkshops = async () => {
      setIsLoading(true);
      try {
        const data = await getWorkshops();
        setWorkshops(
          data.map((workshop) => ({
            ...workshop,
            date: new Date(workshop.date),
          }))
        );
      } catch (error) {
        console.error("Error getting workshops:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkshops();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, modalityFilter, statusFilter, searchTerm]);

  const openDeleteModal = (workshop) => {
    setSelectedWorkshopId(workshop.id);
    setMessage(`¿Estás seguro de que deseas eliminar el taller "${workshop.name}"? Esta acción no se puede deshacer.`);
    setIsModalOpen(true);
  };

  const handleDelete = async (reason) => {
    try {
      await deleteWorkshop(selectedWorkshopId, reason); 
      setWorkshops(
        workshops.filter((workshop) => workshop.id !== selectedWorkshopId)
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error eliminando el taller:", error);
      setIsModalOpen(false);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/talleres/detalles/${id}/`);
  };

  const filteredWorkshops = workshops.filter((workshop) => {
    const workshopStatus = new Date(workshop.date) > new Date() ? "Pendiente" : "Realizado";
    
    return (
      (!dateFilter || workshop.date.toISOString().slice(0, 10) === dateFilter) &&
      (!modalityFilter || workshop.modality.includes(modalityFilter)) &&
      (!statusFilter || workshopStatus === statusFilter) &&
      (!searchTerm || workshop.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const lastPageIndex = currentPage * workshopsPerPage;
  const firstPageIndex = lastPageIndex - workshopsPerPage;
  const currentWorkshops = filteredWorkshops.slice(firstPageIndex, lastPageIndex);
  const totalPages = Math.ceil(filteredWorkshops.length / workshopsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const getStatusBadge = (workshopDate) => {
    const isUpcoming = new Date(workshopDate) > new Date();
    return isUpcoming 
      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
      : "bg-green-100 text-green-800 border border-green-200";
  };

  const handleDownloadCSV = () => {
    // Implementar descarga CSV
    alert("Función de descarga CSV próximamente");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner message="Cargando talleres..." size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            🎯 Lista de Talleres
          </h1>
          <p className="text-sm text-gray-600">
            {filteredWorkshops.length} taller{filteredWorkshops.length !== 1 ? 'es' : ''} encontrado{filteredWorkshops.length !== 1 ? 's' : ''}
          </p>
          <div className="w-16 h-1 bg-red-600 rounded-full mt-1"></div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar por nombre del taller..."
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

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Modalidad
                </label>
                <select
                  value={modalityFilter}
                  onChange={(e) => setModalityFilter(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todas las modalidades</option>
                  <option value="presencial">🏢 Presencial</option>
                  <option value="virtual">💻 Virtual</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todos los estados</option>
                  <option value="Pendiente">⏳ Pendiente</option>
                  <option value="Realizado">✅ Realizado</option>
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
                    Taller
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Horario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Modalidad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Cupos
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Talleristas
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
                {currentWorkshops.map((workshop) => (
                  <tr key={workshop.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {workshop.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {workshop.details}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {workshop.date.toISOString().slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      <div className="text-xs">
                        <div>🕒 {workshop.start_time}</div>
                        <div>➡️ {workshop.end_time}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <div className="text-xs line-clamp-2">
                        {workshop.location}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        workshop.modality === 'presencial' 
                          ? 'bg-white-100 text-white-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {workshop.modality === 'presencial' ? '🏢 Presencial' : '💻 Virtual'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 text-center">
                      <span className="font-medium">{workshop.slots}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <div className="text-xs">
                        {workshop.facilitators.map((facilitator, idx) => (
                          <div key={idx} className="mb-1 last:mb-0">
                            👤 {facilitator.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(workshop.date)}`}>
                        {new Date(workshop.date) > new Date() ? "⏳ Pendiente" : "✅ Realizado"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(workshop.id)}
                          className="text-white-600 hover:text-red-800 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                          title="Ver detalles"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(workshop)}
                          className="text-white-600 hover:text-red-800 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                          title="Eliminar taller"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {currentWorkshops.map((workshop) => (
              <div key={workshop.id} className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {workshop.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {workshop.details}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(workshop.date)}`}>
                    {new Date(workshop.date) > new Date() ? "⏳" : "✅"}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                  <div>
                    <span className="font-medium">Fecha:</span> {workshop.date.toISOString().slice(0, 10)}
                  </div>
                  <div>
                    <span className="font-medium">Horario:</span> {workshop.start_time} - {workshop.end_time}
                  </div>
                  <div>
                    <span className="font-medium">Modalidad:</span> 
                    <span className={`ml-1 ${
                      workshop.modality === 'presencial' ? 'text-blue-600' : 'text-purple-600'
                    }`}>
                      {workshop.modality === 'presencial' ? '🏢' : '💻'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Cupos:</span> {workshop.slots}
                  </div>
                </div>

                <div className="text-xs text-gray-600 mb-3">
                  <span className="font-medium">Talleristas:</span>
                  {workshop.facilitators.map((facilitator, idx) => (
                    <span key={idx} className="ml-1">
                      {facilitator.name}{idx < workshop.facilitators.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-600 mb-3">
                  <span className="font-medium">Ubicación:</span> {workshop.location}
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleViewDetails(workshop.id)}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200"
                  >
                    <FiEye size={12} />
                    Ver
                  </button>
                  <button
                    onClick={() => openDeleteModal(workshop)}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200"
                  >
                    <FiTrash2 size={12} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {currentWorkshops.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-base font-medium text-gray-900 mb-1">
                No se encontraron talleres
              </h3>
              <p className="text-sm text-gray-500">
                {filteredWorkshops.length === 0 && workshops.length > 0 
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No hay talleres programados en el sistema"
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredWorkshops.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
            <div className="text-xs text-gray-600">
              Mostrando {firstPageIndex + 1}-{Math.min(lastPageIndex, filteredWorkshops.length)} de {filteredWorkshops.length} talleres
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

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message={modalMessage}
        title="Confirmar Eliminación"
      />
    </div>
  );
};

export default WorkshopList;
