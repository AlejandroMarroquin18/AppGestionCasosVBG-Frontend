import { useState } from "react"
import { useParams } from "react-router-dom"
import SuccessModal from "../../components/SuccessModal";
import { baseURL } from "../../api";
// Mover FormField fuera del componente principal
const FormField = ({ label, children, required = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-l-[#d32f2f]/70">
      <label className="block text-[#202124] font-medium mb-4">
        {label}
        {required && <span className="text-[#d32f2f] ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

const ExternalRegistrationForm = () => {
  const { workshopId } = useParams() // Obtener el ID del taller desde la URL
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    document_type: "Cédula", // Valor predeterminado
    document_number: "",
    age: "",
    disability: "Ninguna", // Valor predeterminado
    program: "", // Nueva pregunta para el programa académico
    gender_identity: "Cisgénero", // Valor predeterminado
    self_recognition: "Ninguna", // Valor predeterminado
    institutional_email: "",
    terms_accepted: false, // Aceptación de términos y condiciones
  })

  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estado para el modal de éxito
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // Para el checkbox de aceptación de términos
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Verificando lo que se está enviando antes de hacer el fetch
    console.log("Form data antes de enviar:", formData)

    // Verificar si los términos y condiciones fueron aceptados
    if (!formData.terms_accepted) {
      setErrorMessage("Debe aceptar los términos y condiciones.")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(`${baseURL}/talleres/inscripcion/${workshopId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Respuesta del backend:", data) // Mostrar la respuesta del backend
        setSuccessMessage("¡Inscripción exitosa!")
        setIsSuccessModalOpen(true); // Abrir el modal de éxito
        setErrorMessage("");
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || "Error al inscribirse, intente nuevamente.")
        setSuccessMessage("")
      }
    } catch (error) {
      setErrorMessage("Error al inscribirse, intente nuevamente.")
      setSuccessMessage("")
      console.error("Error al enviar datos:", error) // Mostrar el error en caso de falla
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Form Header with red accent */}
        <div className="bg-gradient-to-r from-[#d32f2f] to-[#f44336] rounded-t-lg h-3"></div>
        <div className="bg-white rounded-b-lg shadow-sm mb-6 p-8 border-t-0">
          <h1 className="text-3xl font-normal text-[#202124] mb-3">Inscripción al taller</h1>
          <div className="w-16 h-1 bg-[#d32f2f] mb-4"></div>
          <p className="text-[#5f6368] border-b pb-4 mb-6">Complete el formulario para inscribirse al taller</p>
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{successMessage}</p>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-[#d32f2f] p-4 mb-6 rounded-lg shadow-sm">
              <p className="text-[#d32f2f]">{errorMessage}</p>
            </div>
          )}

          <FormField label="Nombre completo" required>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d32f2f]"
              required
            />
          </FormField>

          <FormField label="Correo electrónico" required>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d32f2f]"
              required
            />
          </FormField>

          <FormField label="Tipo de documento" required>
            <select
              name="document_type"
              value={formData.document_type}
              onChange={handleChange}
              className="w-full px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d32f2f]"
              required
            >
              <option value="Cédula">Cédula</option>
              <option value="Tarjeta de identidad">Tarjeta de identidad</option>
              <option value="Cédula de extranjería">Cédula de extranjería</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </FormField>

          <FormField label="Número de documento" required>
            <input
              type="text"
              name="document_number"
              value={formData.document_number}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d32f2f]"
              required
            />
          </FormField>

          <FormField label="Edad" required>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d32f2f]"
              required
            />
          </FormField>

          <FormField label="Programa académico / dependencia" required>
            <input
              type="text"
              name="program"
              value={formData.program}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d32f2f]"
              required
            />
          </FormField>

          <FormField label="Identidad de género" required>
            <select
              name="gender_identity"
              value={formData.gender_identity}
              onChange={handleChange}
              className="w-full px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d32f2f]"
              required
            >
              <option value="Cisgénero">Cisgénero</option>
              <option value="Transgénero">Transgénero</option>
              <option value="Género fluido">Género fluido</option>
              <option value="No binario y/o queer">No binario y/o queer</option>
              <option value="Prefiero no responder">Prefiero no responder</option>
            </select>
          </FormField>

          <FormField label="¿Usted se autoreconoce como?" required>
            <select
              name="self_recognition"
              value={formData.self_recognition}
              onChange={handleChange}
              className="w-full px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d32f2f]"
              required
            >
              <option value="Negra/o/e y/o afrodescendiente">Negra/o/e y/o afrodescendiente</option>
              <option value="Raizal/palenquera/o/e">Raizal/palenquera/o/e</option>
              <option value="Mestiza/o/e">Mestiza/o/e</option>
              <option value="Gitana/o/e y/o room">Gitana/o/e y/o room</option>
              <option value="Ninguna">Ninguna</option>
            </select>
          </FormField>

          <FormField label="Discapacidad">
            <select
              name="disability"
              value={formData.disability}
              onChange={handleChange}
              className="w-full px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d32f2f]"
            >
              <option value="Ninguna">Ninguna</option>
              <option value="Motriz">Motriz</option>
              <option value="Visual">Visual</option>
              <option value="Auditiva">Auditiva</option>
              <option value="Cognitiva">Cognitiva</option>
              <option value="Múltiple">Múltiple</option>
              <option value="Otro">Otro</option>
            </select>
          </FormField>

          <FormField label="Correo institucional" required>
            <input
              type="email"
              name="institutional_email"
              value={formData.institutional_email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d32f2f]"
              required
            />
          </FormField>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-l-[#d32f2f]/70">
            <div className="flex items-start">
              <input
                type="checkbox"
                name="terms_accepted"
                checked={formData.terms_accepted}
                onChange={handleChange}
                className="mt-1 mr-3 h-4 w-4 text-[#d32f2f] focus:ring-[#d32f2f]"
                required
              />
              <span className="text-[#202124]">
                Acepto los términos y condiciones
                <span className="text-[#d32f2f] ml-1">*</span>
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-6 border-l-4 border-l-[#d32f2f]/70">
            <div className="text-sm text-[#5f6368]">
              <span className="text-[#d32f2f]">*</span> Indica un campo obligatorio
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-[#d32f2f] to-[#f44336] text-white rounded-md hover:from-[#c62828] hover:to-[#e53935] focus:outline-none focus:ring-2 focus:ring-[#d32f2f] focus:ring-offset-2 transition-colors shadow-md"
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />
    </div>
  )
}

export default ExternalRegistrationForm