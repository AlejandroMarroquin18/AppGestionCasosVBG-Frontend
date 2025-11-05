import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../api';

const RestorePassword = () => {
    const navigate = useNavigate();
    const [statusMessage, setMessage] = useState(null);
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPasswordInput] = useState('');
    const [content, setContent] = useState('default'); // default, validacion, changepassword

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleCodigoChange = (e) => setCodigo(e.target.value);
    const handlePasswordChangeInput = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChangeInput = (e) => setConfirmPasswordInput(e.target.value);

    const handleRestorePassword = async () => {
        try {
            const response = await fetch(`${baseURL}/forgottenPassword/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'email': email }),
            });

            if (!response.ok) {
                const data = await response.json();
                console.log(data.message);
                setMessage(data.message);
                return;
            }

            if (response.status === 200) {
                setContent('validacion');
                setMessage(null);
            }

        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleSendCode = async () => {
        try {
            const response = await fetch(`${baseURL}/validateForgottenPasswordCode/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo, email }),
            });

            if (!response.ok) {
                setCodigo('');
                const data = await response.json();
                setMessage(data.message);
                return;
            }

            console.log(response.status);
            if (response.status === 200) {
                setContent('changepassword');
                setMessage(null);
            }

        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleChangePassword = async () => {
        if (password !== confirmPassword) {
            console.log("La contraseña no coincide");
            setMessage("Las contraseñas no coinciden");
            return null;
        }
        try {
            const response = await fetch(`${baseURL}/changeForgottenPassword/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, codigo, password }),
            });
            if (!response.ok) {
                const data = await response.json();
                setMessage(data.message);
                throw new Error(data.message);
            }

            if (response.status === 200) {
                navigate('/login');
            }

        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-0">
            <div className="flex flex-col md:flex-row w-full h-screen bg-white">
                {/* Sección de imagen - 70% en desktop */}
                <div className="hidden md:flex md:w-[70%] relative overflow-hidden">
                    <img 
                        src="/login1.jpg" 
                        alt="" 
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Sección de imagen - Móvil */}
                <div className="md:hidden w-full h-40 relative overflow-hidden">
                    <img 
                        src="/login2.jpg" 
                        alt="" 
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Sección del formulario - 30% en desktop */}
                <div className="w-full md:w-[30%] p-6 md:p-8 flex flex-col justify-center bg-white">
                    <div className="max-w-md w-full mx-auto">
                        
                        {/* Paso 1: Ingresar email */}
                        {content === 'default' && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                        Recuperar contraseña
                                    </h1>
                                    <p className="text-gray-600 text-base">
                                        Ingresa tu correo electrónico para recuperar tu contraseña
                                    </p>
                                </div>

                                {statusMessage && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-sm">
                                        {statusMessage}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Correo electrónico
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="Ingresa tu correo"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <button 
                                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                                        onClick={handleRestorePassword}
                                    >
                                        Enviar código
                                    </button>

                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm border border-gray-300"
                                    >
                                        Volver al inicio de sesión
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Paso 2: Validar código */}
                        {content === 'validacion' && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                        Verificar código
                                    </h1>
                                    <p className="text-gray-600 text-base">
                                        Ingresa el código enviado a tu correo electrónico
                                    </p>
                                </div>

                                {statusMessage && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-sm">
                                        {statusMessage}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-2">
                                        Código de verificación
                                    </label>
                                    <input
                                        id="codigo"
                                        type="text"
                                        value={codigo}
                                        maxLength={6}
                                        onChange={handleCodigoChange}
                                        placeholder="Ingresa el código de 6 dígitos"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm text-center tracking-widest"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <button 
                                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                                        onClick={handleSendCode}
                                    >
                                        Verificar código
                                    </button>

                                    <button 
                                        onClick={() => setContent('default')}
                                        className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm border border-gray-300"
                                    >
                                        Volver atrás
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Paso 3: Cambiar contraseña */}
                        {content === 'changepassword' && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                        Nueva contraseña
                                    </h1>
                                    <p className="text-gray-600 text-base">
                                        Crea una nueva contraseña para tu cuenta
                                    </p>
                                </div>

                                {statusMessage && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-sm">
                                        {statusMessage}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="new_password"className="block text-sm font-medium text-gray-700 mb-2">
                                        Nueva contraseña
                                    </label>
                                    <input
                                        id="new_password"
                                        type="password"
                                        value={password}
                                        onChange={handlePasswordChangeInput}
                                        placeholder="Ingresa tu nueva contraseña"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmar contraseña
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChangeInput}
                                        placeholder="Confirma tu nueva contraseña"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <button 
                                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                                        onClick={handleChangePassword}
                                    >
                                        Cambiar Contraseña
                                    </button>

                                    <button 
                                        onClick={() => setContent('validacion')}
                                        className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm border border-gray-300"
                                    >
                                        Volver atrás
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestorePassword;