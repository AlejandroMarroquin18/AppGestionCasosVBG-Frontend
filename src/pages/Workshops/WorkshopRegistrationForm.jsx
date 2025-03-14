import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { registerExternalParticipant } from "../../api"; // Asegúrate de tener la función de API para enviar la inscripción al backend

const ExternalRegistrationForm = () => {
  const { workshopId } = useParams(); // Obtener el ID del taller desde la URL
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    document_type: "Cédula",  // Valor predeterminado
    document_number: "",
    age: "",
    disability: "Ninguna",  // Valor predeterminado
    program: "",  // Nueva pregunta para el programa académico
    gender_identity: "Cisgénero", // Valor predeterminado
    self_recognition: "Ninguna", // Valor predeterminado
    institutional_email: "",
    terms_accepted: false, // Aceptación de términos y condiciones
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // Para el checkbox de aceptación de términos
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verificando lo que se está enviando antes de hacer el fetch
    console.log("Form data antes de enviar:", formData);
  
    // Verificar si los términos y condiciones fueron aceptados
    if (!formData.terms_accepted) {
      setErrorMessage("Debe aceptar los términos y condiciones.");
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/talleres/inscripcion/${workshopId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Respuesta del backend:", data); // Mostrar la respuesta del backend
        setSuccessMessage("¡Inscripción exitosa!");
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Error al inscribirse, intente nuevamente.");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Error al inscribirse, intente nuevamente.");
      setSuccessMessage("");
      console.error("Error al enviar datos:", error); // Mostrar el error en caso de falla
    }
  };  

  return (
    <div className="w-full p-5">
      <h2 className="text-3xl font-bold text-center mb-6">Inscripción al Taller</h2>
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <div className="mb-4">
          <label className="block text-xl font-semibold mb-2">Nombre Completo</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-xl font-semibold mb-2">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-xl font-semibold mb-2">Tipo de Documento</label>
          <select
            name="document_type"
            value={formData.document_type}
            onChange={handleChange}
            className="w-full h-10 py-2 border border-gray-300 rounded"
            required
          >
            <option value="Cédula">Cédula</option>
            <option value="Tarjeta de identidad">Tarjeta de identidad</option>
            <option value="Cédula de extranjería">Cédula de extranjería</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xl font-semibold mb-2">Número de Documento</label>
          <input
            type="text"
            name="document_number"
            value={formData.document_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-xl font-semibold mb-2">Edad</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-xl font-semibold mb-2">Programa Académico / Dependencia</label>
          <input
            type="text"
            name="program"
            value={formData.program}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-xl font-semibold mb-2">Identidad de Género</label>
          <select
            name="gender_identity"
            value={formData.gender_identity}
            onChange={handleChange}
            className="w-full px-4 h-10 border border-gray-300 rounded"
            required
          >
            <option value="Cisgénero">Cisgénero</option>
            <option value="Transgénero">Transgénero</option>
            <option value="Género fluido">Género fluido</option>
            <option value="No binario y/o queer">No binario y/o queer</option>
            <option value="Prefiero no responder">Prefiero no responder</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xl font-semibold mb-2">¿Usted se autoreconoce como?</label>
          <select
            name="self_recognition"
            value={formData.self_recognition}
            onChange={handleChange}
            className="w-full px-4 h-10 border border-gray-300 rounded"
            required
          >
            <option value="Negra/o/e y/o afrodescendiente">Negra/o/e y/o afrodescendiente</option>
            <option value="Raizal/palenquera/o/e">Raizal/palenquera/o/e</option>
            <option value="Mestiza/o/e">Mestiza/o/e</option>
            <option value="Gitana/o/e y/o room">Gitana/o/e y/o room</option>
            <option value="Ninguna">Ninguna</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xl font-semibold mb-2">Discapacidad</label>
          <select
            name="disability"
            value={formData.disability}
            onChange={handleChange}
            className="w-full px-4 h-10 border border-gray-300 rounded"
          >
            <option value="Ninguna">Ninguna</option>
            <option value="Motriz">Motriz</option>
            <option value="Visual">Visual</option>
            <option value="Auditiva">Auditiva</option>
            <option value="Cognitiva">Cognitiva</option>
            <option value="Múltiple">Múltiple</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xl font-semibold mb-2">Correo Institucional</label>
          <input
            type="email"
            name="institutional_email"
            value={formData.institutional_email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-xl font-semibold mb-2">
            <input
              type="checkbox"
              name="terms_accepted"
              checked={formData.terms_accepted}
              onChange={handleChange}
              className="mr-2"
              required
            />
            Acepto los términos y condiciones
          </label>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg"
          >
            Inscribirse
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExternalRegistrationForm;