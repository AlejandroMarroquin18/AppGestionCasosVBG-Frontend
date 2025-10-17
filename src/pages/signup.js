import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { baseURL } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const SignUp = () => {
  const navigate = useNavigate();
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
    // Limpiar mensaje de error cuando el usuario empiece a escribir
    if (errorMessage) setErrorMessage(null);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@correounivalle\.edu\.co$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!userCredentials.email || !userCredentials.password || !userCredentials.confirmPassword) {
      setErrorMessage("Por favor completa todos los campos");
      return;
    }

    if (!validateEmail(userCredentials.email)) {
      setErrorMessage("Debes usar un correo institucional de la Universidad del Valle (@correounivalle.edu.co)");
      return;
    }

    if (userCredentials.password !== userCredentials.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    if (userCredentials.password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${baseURL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userCredentials.email,
          password: userCredentials.password,
          // Datos por defecto que podrían venir del backend
          nombre: "Usuario Univalle",
          rol: "usuario",
          username: userCredentials.email.split('@')[0], // Username basado en el email
          telefono: "No especificado"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Mostrar éxito por un momento antes de redirigir
        setTimeout(() => {
          setIsLoading(false);
          alert("¡Registro exitoso! Serás redirigido al login.");
          navigate('/login');
        }, 1500);
        
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error en el registro. El correo ya podría estar en uso.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setErrorMessage("Error en la conexión. Verifica tu conexión a internet.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <LoadingSpinner 
          message="Creando tu cuenta..."
          overlay={true}
          size="large"
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-0">
        <div className="flex flex-col md:flex-row w-full h-screen bg-white">
          {/* Sección de imagen - 70% en desktop */}
          <div className="hidden md:flex md:w-[70%] relative overflow-hidden">
            <img 
              src="/login1.jpg" 
              alt="Registro desktop" 
              className="w-full h-full object-cover"
            />
 
          </div>

          {/* Sección de imagen - Móvil */}
          <div className="md:hidden w-full h-40 relative overflow-hidden">
            <img 
              src="/login2.jpg" 
              alt="Registro mobile" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sección del formulario - 30% en desktop */}
          <div className="w-full md:w-[30%] p-6 md:p-8 flex flex-col justify-center bg-white overflow-y-auto">
            <div className="max-w-md w-full mx-auto">
              {/* Títulos */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Crear Cuenta
                </h1>
              </div>

              {/* Mensaje de error */}
              {errorMessage && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-5">
                {/* Campo Email Institucional */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo institucional *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userCredentials.email}
                    onChange={handleChange}
                    placeholder="usuario@correounivalle.edu.co"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Solo se permiten cuentas institucionales
                  </p>
                </div>

                {/* Campo Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={userCredentials.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                    disabled={isLoading}
                  />
                </div>

                {/* Campo Confirmar Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={userCredentials.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                    disabled={isLoading}
                  />
                </div>

                {/* Botón de Registro */}
                <button
                  className={`w-full py-2.5 px-4 text-white font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm ${
                    isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creando cuenta...
                    </span>
                  ) : (
                    'Crear Cuenta'
                  )}
                </button>

                {/* Enlace para volver al login */}
                <div className="text-center pt-2">
                  <p className="text-gray-600 text-sm">
                    ¿Ya tienes una cuenta?{' '}
                    <Link 
                      to="/login" 
                      className={`text-blue-600 hover:text-blue-800 font-low transition-colors duration-200 hover:underline ${
                        isLoading ? 'pointer-events-none opacity-50' : ''
                      }`}
                    >
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;