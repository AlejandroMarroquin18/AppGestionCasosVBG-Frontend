import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/googleAuthButton';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Usuario no encontrado o credenciales incorrectas');
      }

      const data = await response.json();
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userName', data.user.nombre);
      localStorage.setItem('userRole', data.user.rol);
      navigate('/');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/4">
        <h3 className="text-3xl font-bold text-center text-gray-700">Iniciar Sesión</h3>
        {errorMessage && <p className="text-lg text-red-500 text-center mt-2">{errorMessage}</p>}
        <div className="mt-4">
          <label className="block text-xl font-medium text-gray-700" htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            placeholder="Ingresa tu correo"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="w-full px-4 py-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <label className="block mt-4 text-xl font-medium text-gray-700" htmlFor="password">Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full px-4 py-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <button
            className="w-full px-6 py-3 mt-6 text-xl text-white bg-red-600 rounded-lg hover:bg-red-700"
            onClick={handleLogin}
          >
            Iniciar Sesión
          </button>

          <div className="mt-6 text-center">
            <GoogleLoginButton />
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <a href="/restorepassword" className="hover:text-blue-700 hover:underline">Olvidé mi contraseña</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;