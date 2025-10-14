import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWorkshopDetails, updateWorkshop, deleteWorkshop } from "../../api";
import DeleteModal from "../../components/DeleteModal";
import ConfirmationModal from "../../components/ConfirmationModal";

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 last:mb-0">
      <button
        className="w-full text-left text-lg font-semibold bg-red-500 p-4 rounded-t-lg text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      {isOpen && (
        <div className="bg-white p-4 border-l-4 border-r-4 border-b-4 border-red-500 rounded-b-lg">
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
  const [participants, setParticipants] = useState([]); // Nuevo estado para los participantes
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
        setParticipants(data.participants || []); // Asigna los participantes desde la respuesta
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
    { key: "name", label: "Nombre", type: "text" },
    { key: "date", label: "Fecha de inicio", type: "date" },
    { key: "start_time", label: "Hora de inicio", type: "time" },
    { key: "end_time", label: "Hora de finalización", type: "time" },
    { key: "location", label: "Lugar", type: "text" },
    {
      key: "modality",
      label: "Modalidad",
      type: "select",
      options: ["presencial", "virtual"],
    },
    { key: "slots", label: "Personas beneficiarias", type: "number" },
    { key: "facilitators", label: "Talleristas", type: "facilitators" },
    { key: "details", label: "Descripción del taller", type: "textarea" },
    { key: "qr_code_url", label: "Código QR", type: "text" }, // Campo para mostrar el QR
  ];

  const openDeleteModal = () => {
    if (!workshop) return;
    setMessage(
      `¿Estás seguro de que deseas eliminar el taller "${workshop.name}"?`
    );
    setIsModalOpen(true);
  };

  const askForConfirmation = () => {
    setShowConfirmationModal(true);
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {error}
      </div>
    );
  if (!workshop)
    return (
      <div className="flex justify-center items-center h-screen">
        No hay detalles disponibles para el taller.
      </div>
    );

  return (
    <div className="w-full p-5">
      <h1 className="text-3xl font-bold text-center mb-6">
        Detalles del taller
      </h1>
      <Accordion title="Información general del taller">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody>
              {displayFields.map(({ key, label, type, options }) => (
                <tr key={key}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-lg">
                    {label}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      key === "facilitators" ? (
                        <div>
                          {workshop.facilitators.map((facilitator, index) => (
                            <div key={index} className="flex mb-2">
                              <input
                                type="text"
                                className="border rounded px-2 py-1 w-full"
                                value={facilitator.name}
                                onChange={(e) => {
                                  const updatedFacilitators = [
                                    ...workshop.facilitators,
                                  ];
                                  updatedFacilitators[index].name =
                                    e.target.value;
                                  handleInputChange(
                                    "facilitators",
                                    updatedFacilitators
                                  );
                                }}
                              />
                              <button
                                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                                onClick={() => {
                                  const updatedFacilitators =
                                    workshop.facilitators.filter(
                                      (_, i) => i !== index
                                    );
                                  handleInputChange(
                                    "facilitators",
                                    updatedFacilitators
                                  );
                                }}
                              >
                                Eliminar
                              </button>
                            </div>
                          ))}
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => {
                              handleInputChange("facilitators", [
                                ...workshop.facilitators,
                                { name: "" },
                              ]);
                            }}
                          >
                            Agregar Tallerista
                          </button>
                        </div>
                      ) : type === "select" ? (
                        <select
                          className="border rounded px-2 py-1 w-full"
                          value={workshop[key]}
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                        >
                          {options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : type === "textarea" ? (
                        <textarea
                          className="border rounded px-2 py-1 w-full"
                          value={workshop[key]}
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          rows="4"
                        ></textarea>
                      ) : (
                        <input
                          type={type}
                          className="border rounded px-2 py-1 w-full"
                          value={workshop[key]}
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                        />
                      )
                    ) : key === "qr_code_url" ? (
                      <div className="flex flex-col items-justify">
                        {workshop.qr_imagen ? (
                          <>
                            <img
                              src={`data:image/png;base64,${workshop.qr_imagen}`}
                              alt="Código QR del taller"
                              className="w-48 h-48 mb-4 border border-gray-300 rounded"
                            />
                            <div className="text-justify">
                              <p className="font-semibold mb-2">Enlace de inscripción:</p>
                              <a
                                href={workshop.qr_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 break-all"
                              >
                                {workshop.qr_link}
                              </a>
                              <div className="mt-4">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(workshop.qr_link);
                                    alert('Enlace copiado al portapapeles');
                                  }}
                                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                >
                                  Copiar enlace
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-500">QR no generado aún</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-lg">
                        {key === "facilitators"
                          ? workshop.facilitators.map((facilitator, idx) => (
                              <span key={idx}>
                                {facilitator.name}
                                {idx < workshop.facilitators.length - 1
                                  ? ", "
                                  : ""}
                              </span>
                            ))
                          : workshop[key]}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Accordion>
      <Accordion title="Personas inscritas">
        {participants.length > 0 ? (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Correo</th>
                <th className="border p-2">Tipo de Documento</th>
                <th className="border p-2">Número de Documento</th>
                <th className="border p-2">Edad</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{participant.full_name}</td>
                  <td className="border p-2">{participant.email}</td>
                  <td className="border p-2">{participant.document_type}</td>
                  <td className="border p-2">{participant.document_number}</td>
                  <td className="border p-2">{participant.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center p-4 text-lg">
            No hay participantes inscritos.
          </p>
        )}
      </Accordion>
      <Accordion title="Personas participantes"></Accordion>

      <div className="flex justify-center space-x-4 mt-4">
        {isEditing ? (
          <>
            <button
              onClick={askForConfirmation}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Guardar Cambios
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Editar Taller
          </button>
        )}
        <button
          onClick={openDeleteModal}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Eliminar Taller
        </button>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message={message}
      />

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCloseModal}
        onConfirm={handleSaveChanges}
        message="¿Estás seguro de que deseas guardar los cambios?"
      />
    </div>
  );
};

export default WorkshopDetails;
