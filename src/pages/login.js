import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/googleAuthButton';
import './out.css';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  
  const handleLogin = async () => {
    console.log({ email, password });
    
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
       // Verificar los datos almacenados
      console.log("Token:", localStorage.getItem('userToken'));
      console.log("Nombre del Usuario:", localStorage.getItem('userName'));
      console.log("Rol del Usuario:", localStorage.getItem('userRole'));
  
      console.log(data.status);
      if (response.status === 200) {
        navigate('/'); 
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
          <div><GoogleLoginButton/></div>
          <a href='restorepassword' >Olvidé mi Contraseña</a>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
        
      </header>
    </div>


  );
};

export default Login;