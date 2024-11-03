import React, { useState } from 'react';

const SignUp = () => {
  const [userCredentials, setUserCredentials] = useState({
    email:'',
    password:''
  });

  
 
  return (
  
    <div className="App">
      <header className="App-header">
        <h1>Correo Electronico</h1>
        <input></input>
        <h1>Contraseña</h1>
        <input></input>
        <h1>Confirmar Contraseña</h1>
        <input></input>
        <button onClick={() => setUserCredentials({ email: '', password: '' })}>
          registrarse
        </button>
        
      </header>
    </div>


  );
};

export default SignUp;