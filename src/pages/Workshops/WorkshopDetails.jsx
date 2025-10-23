import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWorkshopDetails, updateWorkshop, deleteWorkshop } from "../../api";
import DeleteModal from "../../components/DeleteModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { FiEdit, FiSave, FiX, FiTrash2, FiCopy, FiUser, FiMail, FiFileText, FiCalendar } from "react-icons/fi";

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6 last:mb-0">
      <button
        className="w-full text-left text-lg font-semibold bg-red-600 hover:bg-red-700 p-4 rounded-t-lg text-white transition-colors duration-200 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className="transform transition-transform duration-200">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="bg-white p-6 border border-gray-200 rounded-b-lg shadow-sm">
          {children}
        </div>
      )}
    </div>
  );
};

function formatDate(dateStr, type) {
  if (type === "date") {
    const [year, month, day] = dateStr.split("-");
    const date = new Date(Date.UTC(year, month - 1, day));
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    }).format(date);
  } else if (type === "time") {
    if (/^\d{2}:\d{2}:\d{2}$/.test(dateStr)) {
      const [hours, minutes] = dateStr.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else {
      return "No disponible";
    }
  }
  return dateStr;
}

const WorkshopDetails = () => {
  const workshopId = useParams().workshopId;
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    const getWorkshop = async () => {
      try {
        const data = await getWorkshopDetails(workshopId);
        console.log("Workshop data:", data);
        setWorkshop(data);
        setParticipants(data.participants || []);
      } catch (err) {
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    getWorkshop();
  }, [workshopId]);

  const handleInputChange = (field, value) => {
    setWorkshop({ ...workshop, [field]: value });
  };

  const handleSaveChanges = async () => {
    const formattedData = {
      ...workshop,
      start_time: formatTimeForBackend(workshop.start_time),
      end_time: formatTimeForBackend(workshop.end_time),
    };

    try {
      const updatedData = await updateWorkshop(workshopId, formattedData);
      setWorkshop(updatedData);
      setIsEditing(false);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  function formatTimeForBackend(time) {
    const [hours, minutes] = time.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
  }

  const handleDelete = async () => {
    try {
      await deleteWorkshop(workshopId);
      console.log("Taller eliminado correctamente");
      setMessage("Taller eliminado exitosamente");
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
        navigate("/talleres/ver");
      }, 2000);
    } catch (error) {
      console.error("Error eliminando el taller:", error);
      setError(error.toString());
      setIsModalOpen(true);
      setMessage("Error al eliminar el taller");
    }
  };

  const displayFields = [
    { key: "name", label: "Nombre del Taller", type: "text" },
    { key: "date", label: "Fecha", type: "date" },
    { key: "start_time", label: "Hora de Inicio", type: "time" },
    { key: "end_time", label: "Hora de Finalización", type: "time" },
    { key: "location", label: "Ubicación", type: "text" },
    {
      key: "modality",
      label: "Modalidad",
      type: "select",
      options: ["presencial", "virtual"],
    },
    { key: "slots", label: "Cupos Disponibles", type: "number" },
    { key: "facilitators", label: "Talleristas", type: "facilitators" },
    { key: "details", label: "Descripción", type: "textarea" },
    { key: "qr_code_url", label: "Código QR", type: "text" },
  ];

  const openDeleteModal = () => {
    if (!workshop) return;
    setMessage(
      `¿Estás seguro de que deseas eliminar el taller "${workshop.name}"? Esta acción no se puede deshacer.`
    );
    setIsModalOpen(true);
  };

  const askForConfirmation = () => {
    setShowConfirmationModal(true);
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Enlace copiado al portapapeles');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner message="Cargando detalles del taller..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar el taller</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No hay detalles disponibles</h2>
          <p className="text-gray-600">No se encontró información para este taller</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🎯 Detalles del taller
          </h1>
          <p className="text-gray-600">
            Información completa y participantes inscritos
          </p>
          <div className="w-20 h-1 bg-red-600 rounded-full mt-2"></div>
        </div>

        {/* Información General del Taller */}
        <Accordion title="📋 Información general" defaultOpen={true}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna 1 */}
            <div className="space-y-4">
              {displayFields.slice(0, 5).map(({ key, label, type, options }) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  {isEditing ? (
                    type === "select" ? (
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={workshop[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                      >
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option === 'presencial' ? '🏢 Presencial' : '💻 Virtual'}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={workshop[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                      />
                    )
                  ) : (
                    <div className="text-gray-900">
                      {key === "modality" ? (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          workshop[key] === 'presencial' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {workshop[key] === 'presencial' ? '🏢 Presencial' : '💻 Virtual'}
                        </span>
                      ) : (
                        workshop[key] || "No especificado"
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Columna 2 */}
            <div className="space-y-4">
              {displayFields.slice(5).map(({ key, label, type, options }) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  {isEditing ? (
                    key === "facilitators" ? (
                      <div className="space-y-2">
                        {workshop.facilitators.map((facilitator, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                              value={facilitator.name}
                              onChange={(e) => {
                                const updatedFacilitators = [...workshop.facilitators];
                                updatedFacilitators[index].name = e.target.value;
                                handleInputChange("facilitators", updatedFacilitators);
                              }}
                              placeholder="Nombre del tallerista"
                            />
                            <button
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                              onClick={() => {
                                const updatedFacilitators = workshop.facilitators.filter((_, i) => i !== index);
                                handleInputChange("facilitators", updatedFacilitators);
                              }}
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm"
                          onClick={() => {
                            handleInputChange("facilitators", [
                              ...workshop.facilitators,
                              { name: "" },
                            ]);
                          }}
                        >
                          <FiUser size={14} />
                          Agregar Tallerista
                        </button>
                      </div>
                    ) : type === "textarea" ? (
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        value={workshop[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        rows="4"
                      />
                    ) : (
                      <input
                        type={type}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={workshop[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                      />
                    )
                  ) : key === "facilitators" ? (
                    <div className="space-y-1">
                      {workshop.facilitators.map((facilitator, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-900">
                          <FiUser size={14} className="text-gray-500" />
                          {facilitator.name}
                        </div>
                      ))}
                    </div>
                  ) : key === "qr_code_url" ? (
                    <div className="flex flex-col items-center space-y-3">
                      {workshop.qr_imagen ? (
                        <>
                          <img
                            src={`data:image/png;base64,${workshop.qr_imagen}`}
                            alt="Código QR del taller"
                            className="w-32 h-32 border border-gray-300 rounded-lg"
                          />
                          <div className="text-center">
                            <button
                              onClick={() => copyToClipboard(workshop.qr_link)}
                              className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm"
                            >
                              <FiCopy size={12} />
                              Copiar enlace
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500 text-sm">QR no generado aún</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-900">
                      {workshop[key] || "No especificado"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Accordion>

        {/* Personas Inscritas */}
        <Accordion title={`👥 Personas inscritas (${participants.length})`}>
          {participants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      <FiUser className="inline mr-1" />
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      <FiMail className="inline mr-1" />
                      Correo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      <FiFileText className="inline mr-1" />
                      Tipo Doc
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      <FiFileText className="inline mr-1" />
                      Número Doc
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      <FiCalendar className="inline mr-1" />
                      Edad
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map((participant, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                        {participant.full_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {participant.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {participant.document_type}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 font-mono">
                        {participant.document_number}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {participant.age}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No hay inscritos</h3>
              <p className="text-gray-500">Aún no hay personas inscritas en este taller</p>
            </div>
          )}
        </Accordion>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          {isEditing ? (
            <>
              <button
                onClick={askForConfirmation}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FiSave size={16} />
                Guardar Cambios
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FiX size={16} />
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FiEdit size={16} />
              Editar Taller
            </button>
          )}
          <button
            onClick={openDeleteModal}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <FiTrash2 size={16} />
            Eliminar Taller
          </button>
        </div>
      </div>

      {/* Modales */}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message={message}
        title="Confirmar Eliminación"
      />

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCloseModal}
        onConfirm={handleSaveChanges}
        message="¿Estás seguro de que deseas guardar los cambios realizados en este taller?"
        title="Confirmar Cambios"
      />
    </div>
  );
};

export default WorkshopDetails;