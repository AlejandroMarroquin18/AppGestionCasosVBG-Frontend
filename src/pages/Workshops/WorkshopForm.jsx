import React, { useState, useEffect } from "react";
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
    modality: "presencial",
    slots: "",
    facilitators: [""],
  });

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [workshopId, setWorkshopId] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Validar fechas y horas cuando cambian
  useEffect(() => {
    const newErrors = {...errors};
    
    // Validar que la fecha no sea anterior a hoy
    if (formData.date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.date);
      
      if (selectedDate < today) {
        newErrors.date = "La fecha no puede ser anterior al día actual";
      } else {
        delete newErrors.date;
      }
    }
    
    // Validar horas
    if (formData.start_time && formData.end_time) {
      const [startHours, startMinutes] = formData.start_time.split(':').map(Number);
      const [endHours, endMinutes] = formData.end_time.split(':').map(Number);
      
      // Calcular duración en minutos
      const duration = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
      
      if (duration <= 0) {
        newErrors.time = "La hora de finalización debe ser posterior a la de inicio";
      } else if (duration < 60) {
        newErrors.time = "El taller debe durar al menos 1 hora";
      } else {
        delete newErrors.time;
      }
    }
    
    setErrors(newErrors);
  }, [formData.date, formData.start_time, formData.end_time]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "facilitators") {
      const updatedFacilitators = [...formData.facilitators];
      updatedFacilitators[e.target.dataset.index] = value;
      setFormData({ ...formData, facilitators: updatedFacilitators });
    } else {
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

  const validateForm = () => {
    const newErrors = {};
    
    // Validar campos requeridos
    if (!formData.name.trim()) newErrors.name = "Nombre del taller es requerido";
    if (!formData.date) newErrors.date = "Fecha es requerida";
    if (!formData.start_time) newErrors.start_time = "Hora de inicio es requerida";
    if (!formData.end_time) newErrors.end_time = "Hora de fin es requerida";
    if (!formData.details.trim()) newErrors.details = "Detalles son requeridos";
    if (!formData.location.trim()) newErrors.location = "Ubicación es requerida";
    if (!formData.slots || formData.slots <= 0) newErrors.slots = "Cupos válidos son requeridos";
    
    // Validar al menos un tallerista con nombre
    const hasFacilitators = formData.facilitators.some(f => f.trim());
    if (!hasFacilitators) newErrors.facilitators = "Al menos un tallerista es requerido";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validación básica de campos requeridos
    if (!validateForm()) {
      setShowWarningModal(true);
      return;
    }
    
    // Verificar si hay errores de validación adicionales
    if (Object.keys(errors).length > 0) {
      setShowWarningModal(true);
      return;
    }
  
    const facilitatorsArray = formData.facilitators
      .map((facilitator) => ({ name: facilitator.trim() }))
      .filter((facilitator) => facilitator.name);
  
    const participantsArray = [];

    
  
    try {
      const data = await createWorkshop({
        ...formData,
        facilitators: facilitatorsArray,
        participants: participantsArray,
      });
      setWorkshopId(data.id);
      setQrCodeUrl(data.qr_code_url);
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
              className={`w-full px-6 py-4 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
              min={new Date().toISOString().split('T')[0]} // Establece la fecha mínima como hoy
              className={`w-full px-6 py-4 bg-white border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
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
              className={`w-full px-6 py-4 bg-white border ${errors.start_time ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
            />
            {errors.start_time && <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>}
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
              className={`w-full px-6 py-4 bg-white border ${errors.end_time ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
            />
            {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Modalidad
            </label>
            <select
              name="modality"
              value={formData.modality}
              onChange={handleChange}
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
              className={`w-full px-6 py-4 bg-white border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
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
              min="1"
              className={`w-full px-6 py-4 bg-white border ${errors.slots ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
            />
            {errors.slots && <p className="text-red-500 text-sm mt-1">{errors.slots}</p>}
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
                  data-index={index}
                  className={`w-full px-6 py-4 bg-white border ${errors.facilitators && index === 0 ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
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
            {errors.facilitators && <p className="text-red-500 text-sm mt-1">{errors.facilitators}</p>}
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">
              Detalles
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              className={`w-full px-6 py-4 bg-white border ${errors.details ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
              rows="6"
            ></textarea>
            {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details}</p>}
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
            message="Por favor completa todos los campos requeridos y corrige los errores."
          />
        )}
      </form>
    </div>
  );
};

export default WorkshopForm;