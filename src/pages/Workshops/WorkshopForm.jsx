import React, { useState } from "react";
import { createWorkshop } from "../../api";
import SuccessModal from "../../components/SuccessModal";

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
    facilitator: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createWorkshop(formData);
      console.log("Taller creado:", data);
      setSubmitSuccess(true); // Indica que el envío fue exitoso
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const handleModalClose = () => {
    setSubmitSuccess(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 shadow-md rounded-lg p-8 w-full max-w-3xl"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Crear Taller
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xl">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre del Taller
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Fecha del Taller
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Hora de Inicio
            </label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Hora de Finalización
            </label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Modalidad
            </label>
            <select
              name="modality"
              value={formData.modality}
              onChange={handleChange}
              className="w-full px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
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
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
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
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tallerista
            </label>
            <input
              type="text"
              name="facilitator"
              value={formData.facilitator}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">
              Detalles
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              rows="4"
            ></textarea>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700"
          >
            Guardar Taller
          </button>
        </div>
        {submitSuccess && <SuccessModal isOpen={submitSuccess} onClose={handleModalClose} message="¡Taller creado exitosamente!" />}
      </form>
    </div>
  );
};

export default WorkshopForm;
