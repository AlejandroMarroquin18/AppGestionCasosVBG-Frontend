import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWorkshopDetails, updateWorkshop, deleteWorkshop } from "../../api";
import DeleteModal from "../../components/DeleteModal";

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

const WorkshopDetails = () => {
  const workshopId = useParams().workshopId;
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");


  useEffect(() => {
    const getWorkshop = async () => {
      try {
        const data = await getWorkshopDetails(workshopId);
        setWorkshop(data);
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
    try {
      await updateWorkshop(workshopId, workshop);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

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
    { key: "name", label: "Nombre" },
    { key: "date", label: "Fecha de inicio" },
    { key: "start_time", label: "Hora de inicio" },
    { key: "end_time", label: "Hora de finalización" },
    { key: "location", label: "Lugar" },
    { key: "modality", label: "Modalidad" },
    { key: "slots", label: "Beneficiarios" },
    { key: "facilitator", label: "Tallerista" },
    { key: "details", label: "Descripción del taller" },
  ];

  const openDeleteModal = () => {
    if (!workshop) return; 
    setMessage(`¿Estás seguro de que deseas eliminar el taller "${workshop.name}"?`); 
    setIsModalOpen(true);
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
              {displayFields.map(({ key, label }) => (
                <tr key={key}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-lg">
                    {label}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="text"
                        className="border rounded px-2 py-1 w-full"
                        value={workshop[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                      />
                    ) : (
                      <span className="text-lg">
                        {key === "date"
                          ? new Date(workshop[key]).toLocaleDateString()
                          : workshop[key]}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-lg">
                  Estado
                </td>
                <td className="px-6 py-4">
                  <span className="text-lg">
                    {new Date(workshop.date) > new Date()
                      ? "Pendiente"
                      : "Realizado"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Accordion>
      <Accordion title="Personas inscritas">
        <p className="text-center p-4 text-lg">Sin datos</p>
      </Accordion>
      <Accordion title="Participantes">
        <p className="text-center p-4 text-lg">Sin datos</p>
      </Accordion>
      <div className="flex justify-center space-x-4 mt-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveChanges}
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
    </div>
  );
};

export default WorkshopDetails;
