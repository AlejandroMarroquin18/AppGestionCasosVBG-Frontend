import React, { useState } from "react";
import { createWorkshop } from "../../api";
import SuccessModal from "../../components/SuccessModal";
import WarningModal from "../../components/WarningModal";

const WorkshopForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    start_time: "",
    end_time: "",
    details: "",
    location: "",
    modality: "presencial", // Modalidad predeterminada
    slots: "",
    facilitators: [""], // Cambié facilitators a un array con un campo inicial vacío
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [workshopId, setWorkshopId] = useState(null); // Nueva variable de estado para el ID del taller
  const [qrCodeUrl, setQrCodeUrl] = useState(""); // Nuevo estado para la URL del QR

  // Manejar cambios en los campos generales
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si el campo es un facilitador, actualizamos el array de facilitadores
    if (name === "facilitators") {
      const updatedFacilitators = [...formData.facilitators];
      updatedFacilitators[e.target.dataset.index] = value; // Usamos el índice del facilitador
      setFormData({ ...formData, facilitators: updatedFacilitators });
    } else {
      // Actualizamos los demás campos de forma normal
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddFacilitator = () => {
    setFormData({ ...formData, facilitators: [...formData.facilitators, ""] });
  };

  const handleRemoveFacilitator = (index) => {
    const updatedFacilitators = formData.facilitators.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, facilitators: updatedFacilitators });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validación de campos obligatorios
    if (
      !formData.name ||
      !formData.date ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.details ||
      !formData.location ||
      !formData.slots ||
      !formData.facilitators.every((facilitator) => facilitator.trim())
    ) {
      setShowWarningModal(true);
      return;
    }
  
    const facilitatorsArray = formData.facilitators
      .map((facilitator) => ({ name: facilitator.trim() }))
      .filter((facilitator) => facilitator.name); // Filtramos valores vacíos
  
    const participantsArray = []; // Enviar un arreglo vacío para los participantes si no se tienen
  
    try {
      // Verifica que los datos que se envían al backend sean correctos
      console.log("Datos que se envían:", {
        ...formData,
        facilitators: facilitatorsArray,
        participants: participantsArray, // Asegúrate de incluir este campo vacío
      });
  
      const data = await createWorkshop({
        ...formData,
        facilitators: facilitatorsArray,
        participants: participantsArray, // Incluye el arreglo vacío de participantes
      });
      console.log("Taller creado:", data);
      setWorkshopId(data.id); // Guardamos el ID del taller recién creado
      setQrCodeUrl(data.qr_code_url); // Recibimos la URL del código QR del backend
      setSubmitSuccess(true);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al crear el taller:", error.message);
      alert(error.message);
    }
  };  

  const handleModalClose = () => {
    setSubmitSuccess(false);
    setShowWarningModal(false);
  };

  console.log("Modalidad seleccionada:", formData.modality);

  return (
    <div className="w-full flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 shadow-md rounded-lg p-10 w-full max-w-4xl mx-4 overflow-y-auto"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Crear Taller
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xl">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre del Taller
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Fecha del Taller
            </label>
            <input
              type="date"
              name="date"
              value={formData.date || ""}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Hora de Inicio
            </label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time || ""}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Hora de Finalización
            </label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time || ""}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Modalidad
            </label>
            <select
              name="modality"
              value={formData.modality} // Se asegura de que el valor de modalidad esté bien sincronizado
              onChange={handleChange} // Al seleccionar, se actualiza el estado de modalidad
              className="w-full px-6 h-9 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Ubicación
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Cupos Disponibles
            </label>
            <input
              type="number"
              name="slots"
              value={formData.slots}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Talleristas
            </label>
            {formData.facilitators.map((facilitator, index) => (
              <div key={index} className="flex items-center mb-4">
                <input
                  type="text"
                  name="facilitators"
                  value={facilitator}
                  onChange={handleChange}
                  data-index={index} // Añadimos un atributo data para saber el índice
                  className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFacilitator(index)}
                    className="ml-3 text-white-600 text-xl py-1 px-2"
                  >
                    −
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddFacilitator}
              className="text-white-600 text-xl"
            >
              + Agregar tallerista
            </button>
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">
              Detalles
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              rows="6"
            ></textarea>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700"
          >
            Guardar Taller
          </button>
        </div>
        {submitSuccess && (
          <SuccessModal
            isOpen={submitSuccess}
            onClose={handleModalClose}
            message="¡Taller creado exitosamente!"
          />
        )}
        {showWarningModal && (
          <WarningModal
            isOpen={showWarningModal}
            onClose={handleModalClose}
            message="Por favor completa todos los campos requeridos."
          />
        )}
      </form>
    </div>
  );
};

export default WorkshopForm;