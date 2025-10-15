import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './out.css';
import { baseURL } from '../api';

const SignUp = () => {
  const navigate= useNavigate()
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    nombre:'Daniel',
    rol:'developer',
    username:'Dane',
    telefono:'000000',
    password: '',
    confirmPassword: ''

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const handleSubmit = async () => {
    if (userCredentials.password !== userCredentials.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userCredentials),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Registro exitoso");
        navigate('/login')
        
      } else {
        alert("Error en el registro");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Error en la conexión");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <p>Correo Electrónico</p>
          <input
            name="email"
            value={userCredentials.email}
            onChange={handleChange}
          />
          <p>Contraseña</p>
          <input
            name="password"
            type="password"
            value={userCredentials.password}
            onChange={handleChange}
          />
          <p>Confirmar Contraseña</p>
          <input
            name="confirmPassword"
            type="password"
            value={userCredentials.confirmPassword}
            onChange={handleChange}
          />
          <button className='centered-button' onClick={handleSubmit}>
            Registrarse
          </button>
        </div>
      </header>
    </div>
  );
};

export default SignUp;