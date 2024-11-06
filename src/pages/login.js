import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  
  const handleLogin = async () => {
    try {
      // Realiza la solicitud a la API
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Verifica si la respuesta es correcta
      if (!response.ok) {
        throw new Error('Usuario no encontrado o credenciales incorrectas');
      }

      const data = await response.json();

      if (data.existe) {
        alert('Usuario existe'); // Acción si el usuario existe
        // Aquí podrías redirigir al usuario o guardar el token de autenticación, etc.
      } else {
        setErrorMessage('Usuario no encontrado');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  //Cosas pendientes
  //-Hacer que los inputs se ajusten automaticamente
  //dependiendo de los margenes del contenedor
  //
 
  return (
  
    <div className="App">
      <header className="App-header">

        <div className="container">
          <p>Correo Electronico</p>
          
          <input
              type="email" 
              value={email} 
              onChange={handleEmailChange} 
              placeholder="Ingresa tu correo"
          ></input>
          <p>Contraseña</p>
          <input type="password" 
            value={password} 
            onChange={handlePasswordChange} 
            placeholder="Ingresa tu contraseña"/>
          
          <button className='centered-button' onClick={handleLogin}>
            Iniciar Sesión
          </button>
          <a className='centered-button '>Olvidé mi Contraseña</a>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
          
      </header>
    </div>


  );
};

export default Login;