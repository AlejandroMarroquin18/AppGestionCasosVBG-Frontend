import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/googleAuthButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { baseURL } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async () => {
    console.log('🔵 Iniciando handleLogin normal');
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch(`${baseURL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('🟢 Response status:', response.status);

      if (!response.ok) {
        throw new Error('Usuario no encontrado o credenciales incorrectas');
      }

      const data = await response.json();
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userName', data.user.nombre);
      localStorage.setItem('userRole', data.user.rol);
      
      console.log('🟢 Login exitoso, esperando 1 segundo...');
      
      setTimeout(() => {
        console.log('⏰ Timeout completado, navegando...');
        setIsLoading(false);
        navigate('/');
      }, 1000);
      
    } catch (error) {
      console.log('🔴 Error en login:', error.message);
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };

  // Función para manejar el loading de Google
  const handleGoogleLoading = (loading) => {
    console.log('🔵 Google loading:', loading);
    setIsLoading(loading);
  };

  return (
    <>
      {/* Spinner de carga - Ahora funciona para ambos métodos */}
      {isLoading && (
        <LoadingSpinner 
          message="Iniciando sesión..."
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
              alt="Login desktop" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sección de imagen - Móvil */}
          <div className="md:hidden w-full h-40 relative overflow-hidden">
            <img 
              src="/login2.jpg" 
              alt="Login mobile" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sección del formulario - 30% en desktop */}
          <div className="w-full md:w-[30%] p-6 md:p-8 flex flex-col justify-center bg-white">
            <div className="max-w-md w-full mx-auto">
              

              {/* Títulos */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Iniciar sesión
                </h1>
                <p className="text-gray-600 text-base">
                  Accede a tu cuenta para continuar
                </p>
              </div>

              {/* Mensaje de error */}
              {errorMessage && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-5">
                {/* Campo Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Ingresa tu correo"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                    disabled={isLoading}
                  />
                </div>

                {/* Campo Contraseña */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                    disabled={isLoading}
                  />
                </div>

                {/* Botón de Iniciar Sesión */}
                <button
                  className={`w-full py-2.5 px-4 text-white font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm ${
                    isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Iniciando sesión...
                    </span>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>

                {/* Separador */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500">O continúa con</span>
                  </div>
                </div>

                {/* Botón de Google - AHORA CON STATE DE LOADING */}
                <div className="flex justify-center">
                  <GoogleLoginButton 
                    onLoadingChange={handleGoogleLoading}
                    disabled={isLoading}
                  />
                </div>

                {/* Enlaces adicionales */}
                <div className="text-center space-y-3">
                  <div>
                    <a 
                      href="/restorepassword" 
                      className={`text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline text-sm ${
                        isLoading ? 'pointer-events-none opacity-50' : ''
                      }`}
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  
                  {/* Texto de registro más pequeño y menos prominente */}
                  <div className="text-gray-500 text-[14px] mt-2">
                    ¿No tienes una cuenta?{' '}
                    <a 
                      href="/registrarse" 
                      className={`text-blue-600 hover:text-blue-800 underline text-[14px] ${
                        isLoading ? 'pointer-events-none opacity-50' : ''
                      }`}
                    >
                      Regístrate aquí
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;