import React, { useState, useEffect } from "react";
import { createWorkshop } from "../../api";
import SuccessModal from "../../components/SuccessModal";
import WarningModal from "../../components/WarningModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { FiPlus, FiTrash2, FiCalendar, FiClock, FiUsers, FiMapPin } from "react-icons/fi";

const WorkshopForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    start_time: "",
    end_time: "",
    details: "",
    location: "",
    sede: "",
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
  const [isLoading, setIsLoading] = useState(false);

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
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
  
    if (!validateForm()) {
      setShowWarningModal(true);
      return;
    }
    
    if (Object.keys(errors).length > 0) {
      setShowWarningModal(true);
      return;
    }

    setIsLoading(true);
  
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
    } finally {
      setIsLoading(false);
    }
  };  

  const handleModalClose = () => {
    setSubmitSuccess(false);
    setShowWarningModal(false);
  };

  return (
    <>
      {isLoading && (
        <LoadingSpinner 
          message="Creando taller..."
          overlay={true}
        />
      )}

      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🎯 Crear nuevo taller
            </h1>
            <p className="text-sm text-gray-600">
              Completa la información para programar un nuevo taller
            </p>
            <div className="w-20 h-1 bg-red-600 rounded-full mt-2"></div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre del Taller */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Nombre del taller *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ingresa el nombre del taller"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiCalendar className="inline mr-2" />
                    Fecha del taller *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>

                {/* Modalidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎯 Modalidad *
                  </label>
                  <select
                    name="modality"
                    value={formData.modality}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                  >
                    <option value="presencial">🏢 Presencial</option>
                    <option value="virtual">💻 Virtual</option>
                  </select>
                </div>

                {/* Hora de Inicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiClock className="inline mr-2" />
                    Hora de inicio *
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ${
                      errors.start_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.start_time && <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>}
                </div>

                {/* Hora de Finalización */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiClock className="inline mr-2" />
                    Hora de finalización *
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ${
                      errors.end_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="inline mr-2" />
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder={formData.modality === 'virtual' ? 'Enlace de la reunión virtual' : 'Sede o aula del taller'}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="inline mr-2" />
                    Sede *
                  </label>
                  <input
                    type="text"
                    name="sede"
                    value={formData.sede}
                    onChange={handleChange}
                    placeholder={formData.sede === 'Sede' ? 'Sede del taller' : 'Sede del taller'}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ${
                      errors.sede ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.sede && <p className="text-red-500 text-sm mt-1">{errors.sede}</p>}
                </div>

                {/* Cupos Disponibles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUsers className="inline mr-2" />
                    Cupos disponibles *
                  </label>
                  <input
                    type="number"
                    name="slots"
                    value={formData.slots}
                    onChange={handleChange}
                    min="1"
                    placeholder="Número de participantes"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ${
                      errors.slots ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.slots && <p className="text-red-500 text-sm mt-1">{errors.slots}</p>}
                </div>

                {/* Talleristas */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👥 Talleristas *
                  </label>
                  {formData.facilitators.map((facilitator, index) => (
                    <div key={index} className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        name="facilitators"
                        value={facilitator}
                        onChange={handleChange}
                        data-index={index}
                        placeholder={`Nombre del tallerista ${index + 1}`}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ${
                          errors.facilitators && index === 0 ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formData.facilitators.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFacilitator(index)}
                          className="p-3 text-white-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Eliminar tallerista"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFacilitator}
                    className="flex items-center gap-2 text-white-600 hover:text-red-800 font-medium transition-colors duration-200 mt-2"
                  >
                    <FiPlus size={16} />
                    Agregar tallerista
                  </button>
                  {errors.facilitators && <p className="text-red-500 text-sm mt-1">{errors.facilitators}</p>}
                </div>

                {/* Detalles */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📄 Detalles del taller *
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Describe los objetivos, contenido y actividades del taller..."
                    rows="5"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 resize-none ${
                      errors.details ? 'border-red-500' : 'border-gray-300'
                    }`}
                  ></textarea>
                  {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  🎯 Crear taller
                </button>
              </div>
            </form>
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              <strong>Nota:</strong> Los campos marcados con * son obligatorios. 
              Asegúrate de que toda la información sea correcta antes de crear el taller.
            </p>
          </div>
        </div>
      </div>

      {/* Modales */}
      {submitSuccess && (
        <SuccessModal
          isOpen={showSuccessModal}
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
    </>
  );
};

export default WorkshopForm;