import React, { useState } from 'react';

const Login = () => {
  const [userCredentials, setUserCredentials] = useState({
    email:'',
    password:''
  });

 
  return (
  
    <div className="App">
      <header className="App-header">

        <div className="container">
          <p>Correo Electronico</p>
          <input></input>
          <p>Contraseña</p>
          <input></input>
          {/* Example of using setUserCredentials in an event handler */}
          <button onClick={() => setUserCredentials({ email: '', password: '' })}>
            Iniciar Sesión
          </button>
        </div>
      </header>
    </div>


  );
};

export default Login;