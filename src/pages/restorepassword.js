import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RestorePassword = () => {
    const navigate=useNavigate()
    const [statusMessage,setMessage]= useState(null);
    const [email,setEmail]=useState('')
    const [codigo,setCodigo]=useState('')
    //const [codigoInput,setCodigoInput]=useState(new Array(6).fill(''))
    const [password,setPassword]=useState('')
    const [confirmPassword,setConfirmPasswordInput]=useState('')
    const [content,setContent]=useState('default')//default,validacion,changepassword

    const handleEmailChange=(e)=>setEmail(e.target.value)
    const handleCodigoChange=(e)=>setCodigo(e.target.value)
    /**
    const handleCodigoChange=(e,index)=>{
        console.log(e.target.value)
        setCodigoInput([...codigoInput.map((data,i)=>(i === index? e.target.value:data))])
        
        if(e.target.value && e.target.nextSibling){
            e.target.nextSibling.focus()
        }else if(e.target.previousSibling){
            e.target.previousSibling.focus()
        }
        
    }
     */
    const handlePasswordChangeInput=(e)=>setPassword(e.target.value)
    const handleConfirmPasswordChangeInput=(e)=>setConfirmPasswordInput(e.target.value)

    const testChange=(number)=>{
        const stados=['validacion', 'changepassword']
        setContent(stados[number])
    }

    const handleRestorePassword= async ()=>{
        try {
            const response = await fetch('http://localhost:8000/api/forgottenPassword/',{
                method: 'POST',
                headers: { 'Content-Type':'application/json'},
                body: JSON.stringify({ 'email' :email}), 
            });
            
            if(!response.ok){
                const data = await response.json()
                console.log(data.message)
                setMessage(data.message)
                //throw new Error('Usuario no encontrado')
                return

            }
            //const data = await response.json();

            
            if (response.status===200){ 
            //cambia lo que hay dentro del div y }
            setContent('validacion')
            setMessage(null)
            }
            

        }catch (error){
            setMessage (error.setMessage);
        }
    }


    const handleSendCode= async ()=>{
        try {
            const response = await fetch('http://localhost:8000/api/validateForgottenPasswordCode/',{
                method: 'POST',
                headers: { 'Content-Type':'application/json'},
                body: JSON.stringify({codigo,email}), 
            });

            if(!response.ok){
                setCodigo('')
                const data = await response.json()
                setMessage(data.message)
                //throw new Error('Usuario no encontrado')
                return
            }
            //const data = await response.json();

            console.log(response.status);
            if(response.status === 200){
                //cambia lo que hay dentro del div y
                setContent('changepassword')
                setMessage(null)
            }
             
        }catch (error){
            setMessage (error.setMessage);
        }

    }
    const handleChangePassword= async ()=>{
        if(password!==confirmPassword){
            console.log("La contraseña no coincide")
            setMessage("Las contraseñas no coincide")
            return null
        }
        try {
            const response = await fetch('http://localhost:8000/api/changeForgottenPassword/',{
                method: 'POST',
                headers: { 'Content-Type':'application/json'},
                body: JSON.stringify({email,codigo,password}), 
            });
            if(!response.ok){
                const data = await response.json()
                setMessage(data.message)
                
                throw new Error(data.message)
            }
            //const data = await response.json();

            //console.log(data.status); 
            if(response.status===200){
                navigate('/login')
            }else{

            }

        }catch (error){
            setMessage (error.setMessage);
        }
    }

    return (
    <div className="App">
        <header className="App-header">

            <div className="container">
                {content === 'default' &&(<>
                <h3>Recuperar Contraseña</h3>
                <p>Correo Electronico</p>
                
                <input
                    type="email" 
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Ingresa tu correo"
                ></input>
                
                <button className='centered-button' onClick={handleRestorePassword}>
                    Restaurar Contraseña
                </button>
                
                {statusMessage && <p style={{ color: 'red' }}>{statusMessage}</p>}</>)}





            {content === 'validacion' &&(<>
                <p>Ingrese su código enviado al correo electrónico</p>
                <input type="codigo" value={codigo} maxLength={6} onChange={handleCodigoChange}></input>
                {/**<div className='pin'>
                    {codigoInput.map((data,i)=>{
                        return <input type="text" 
                        value={data}
                        maxLength={1}
                        onChange={(e)=>handleCodigoChange(e, i)}
                        />
                    })}

                </div>*/}
                
                <button className="centered-button" onClick={handleSendCode}>
                Enviar
                </button>
                {statusMessage && <p style={{ color: "red" }}>{statusMessage}</p>}
            </>)}



            {content === 'changepassword' &&(<>
            <h3>Cambiar Contraseña</h3>
            <p>Nueva Contraseña</p>
            <input
            type = "password"
            value = {password}
            onChange={handlePasswordChangeInput}
            placeholder="Nueva Contraseña"
            ></input>
            <p>Confirmar Nueva Contraseña</p>
            <input
            type="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChangeInput}
            placeholder="Confirmar Nueva Contraseña"
            ></input>
            <button className='centered-button' onClick={handleChangePassword}>Cambiar Contraseña</button>
            {statusMessage && <p style={{ color: 'red' }}>{statusMessage}</p>}
            </>)}
            </div>
            
        </header>
    </div>

    )
}

export default RestorePassword;