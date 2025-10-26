import { useState } from "react"
import { useParams } from "react-router-dom"
import SuccessModal from "../../components/SuccessModal";
import WarningModal from "../../components/WarningModal";
import { baseURL } from "../../api";
import { FiUser, FiMail, FiFileText, FiCalendar, FiBook, FiUsers, FiFlag, FiCheck } from "react-icons/fi";

// Componente reutilizable para campos de formulario
const FormField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  options, 
  required = false,
  icon: Icon,
  placeholder = "",
  disabled = false,
  name
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-3">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon size={18} />
        </div>
      )}
      {options ? (
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          name={name}
          className={`w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          }`}
        >
          <option value="">Seleccionar...</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows="4"
          placeholder={placeholder}
          name={name}
          className={`w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 resize-none ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          }`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          name={name}
          className={`w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          }`}
        />
      )}
    </div>
  </div>
);

const WorkshopRegistrationForm = ({ workshop }) => {
  const { workshopId } = useParams()
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    document_type: "Cédula",
    document_number: "",
    age: "",
    disability: "Ninguna",
    program: "",
    gender_identity: "Cisgénero",
    self_recognition: "Ninguna",
    terms_accepted: false,
  })

  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)
  const [warningMessage, setWarningMessage] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    if (!formData.terms_accepted) {
      setWarningMessage("Debe aceptar los términos y condiciones.")
      setIsWarningModalOpen(true)
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

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage("¡Inscripción exitosa! Recibirás un correo de confirmación.")
        setIsSuccessModalOpen(true)
        setErrorMessage("")
        // Limpiar formulario
        setFormData({
          full_name: "",
          email: "",
          document_type: "Cédula",
          document_number: "",
          age: "",
          disability: "Ninguna",
          program: "",
          gender_identity: "Cisgénero",
          self_recognition: "Ninguna",
          terms_accepted: false,
        })
      } else {
        // Manejar diferentes tipos de errores del backend
        let errorMsg = "Error al inscribirse, intente nuevamente."
        
        if (data.document_number) {
          errorMsg = "Ya existe una inscripción con este número de documento para este taller."
        } else if (data.error) {
          errorMsg = data.error
        } else if (data.message) {
          errorMsg = data.message
        } else if (typeof data === 'string') {
          errorMsg = data
        }
        
        setWarningMessage(errorMsg)
        setIsWarningModalOpen(true)
      }
    } catch (error) {
      console.error("Error completo:", error)
      setWarningMessage("Error de conexión, intente nuevamente.")
      setIsWarningModalOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Opciones para los selects
  const documentTypes = ["Cédula", "Tarjeta de identidad", "Cédula de extranjería", "Pasaporte"]
  const genderIdentities = ["Cisgénero", "Transgénero", "Género fluido", "No binario y/o queer", "Prefiero no responder"]
  const selfRecognitions = [
    "Negra/o/e y/o afrodescendiente",
    "Raizal/palenquera/o/e", 
    "Mestiza/o/e",
    "Gitana/o/e y/o room",
    "Ninguna"
  ]
  const disabilities = ["Ninguna", "Motriz", "Visual", "Auditiva", "Cognitiva", "Múltiple", "Otro"]

  // Formatear fecha en español
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header del Formulario - Simplificado */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 h-2"></div>
          <div className="p-8">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Formulario de inscripción
              </h1>
              {workshop && (
                <div className="text-gray-600 space-y-1">
                  <p className="text-lg font-medium">{workshop.name}</p>
                  <p className="text-sm">
                    {formatDate(workshop.date)} - {workshop.location}
                  </p>
                </div>
              )}
              <div className="w-16 h-1 bg-red-600 rounded-full mx-auto mt-4"></div>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit}>
            
            {/* Información Personal */}
            <div className="mb-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Nombre completo"
                  value={formData.full_name}
                  onChange={handleChange}
                  name="full_name"
                  required={true}
                  icon={FiUser}
                  placeholder="Ingrese su nombre completo"
                  disabled={isSubmitting}
                />

                <FormField
                  label="Correo electrónico"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  required={true}
                  icon={FiMail}
                  placeholder="ejemplo@correo.com"
                  disabled={isSubmitting}
                />

                <FormField
                  label="Tipo de documento"
                  value={formData.document_type}
                  onChange={handleChange}
                  name="document_type"
                  options={documentTypes}
                  required={true}
                  icon={FiFileText}
                  disabled={isSubmitting}
                />

                <FormField
                  label="Número de documento"
                  value={formData.document_number}
                  onChange={handleChange}
                  name="document_number"
                  required={true}
                  icon={FiFileText}
                  placeholder="Número de identificación"
                  disabled={isSubmitting}
                />

                <FormField
                  label="Edad"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  name="age"
                  required={true}
                  icon={FiCalendar}
                  placeholder="Su edad"
                  disabled={isSubmitting}
                />

                <FormField
                  label="Programa académico / Dependencia"
                  value={formData.program}
                  onChange={handleChange}
                  name="program"
                  required={true}
                  icon={FiBook}
                  placeholder="Programa o dependencia a la que pertenece"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Información Demográfica */}
            <div className="mb-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Identidad de género"
                  value={formData.gender_identity}
                  onChange={handleChange}
                  name="gender_identity"
                  options={genderIdentities}
                  required={true}
                  icon={FiUsers}
                  disabled={isSubmitting}
                />

                <FormField
                  label="¿Usted se autoreconoce como?"
                  value={formData.self_recognition}
                  onChange={handleChange}
                  name="self_recognition"
                  options={selfRecognitions}
                  required={true}
                  icon={FiFlag}
                  disabled={isSubmitting}
                />

                <FormField
                  label="Discapacidad"
                  value={formData.disability}
                  onChange={handleChange}
                  name="disability"
                  options={disabilities}
                  icon={FiUsers}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Términos y Condiciones */}
            <div className="mb-8">
              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    name="terms_accepted"
                    checked={formData.terms_accepted}
                    onChange={handleChange}
                    className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    required
                    disabled={isSubmitting}
                    id="terms_accepted"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="terms_accepted" className="block text-sm font-medium text-gray-700 mb-2">
                    Aceptación de términos y condiciones
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Acepto los términos y condiciones y autorizo el tratamiento de mis datos personales 
                    de acuerdo con la política de privacidad de la institución. Los datos recopilados 
                    serán utilizados exclusivamente para fines estadísticos y de gestión del taller.
                  </p>
                </div>
              </div>
            </div>

            {/* Botón de Envío */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Campos obligatorios
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <FiCheck size={18} />
                    <span>Confirmar inscripción</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modales */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
        title="¡Inscripción exitosa!"
      />
      
      <WarningModal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        message={warningMessage}
      />
    </div>
  )
}

export default WorkshopRegistrationForm