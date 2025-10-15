import React from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import getCSRFToken from "../helpers/getCSRF";

const GoogleLoginButton = ({ onLoadingChange, disabled = false }) => {
    const navigate = useNavigate();

    const login = useGoogleLogin({
        flow: "auth-code",
        ux_mode: "popup",
        onSuccess: async (codeResponse) => {
            if (onLoadingChange) onLoadingChange(true);
            
            try {
                const response = await fetch("http://192.168.20.58:8000/api/auth/google/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCSRFToken()  
                    },
                    body: JSON.stringify({ code: codeResponse.code }),
                    credentials: "include",
                });

                const data = await response.json();

                if (response.ok) {
                    console.log("Datos recibidos del backend:", data);
                    localStorage.setItem("userToken", data.token);
                    localStorage.setItem("userName", data.user.nombre);
                    localStorage.setItem("userRole", data.user.rol);
                    localStorage.setItem("userEmail", data.user.email);

                    console.log("Usuario autenticado:", data);
                    
                    // Pequeño delay para mostrar el spinner
                    setTimeout(() => {
                        if (onLoadingChange) onLoadingChange(false);
                        navigate("/");
                    }, 1000);
                } else {
                    console.log("Error en la autenticación:", data);
                    if (onLoadingChange) onLoadingChange(false);
                }
            } catch (error) {
                console.error("Error en la conexión:", error);
                if (onLoadingChange) onLoadingChange(false);
            }
        },
        onError: (error) => {
            console.error("Error en login:", error);
            if (onLoadingChange) onLoadingChange(false);
        },
        scope: "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
        access_type: "offline",
        prompt: "consent",
    });

    return (
        <button 
            onClick={login} 
            disabled={disabled}
            className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-blue-600 rounded-lg text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm shadow-sm ${
                disabled 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {disabled ? 'Procesando...' : 'Continuar con Google'}
        </button>
    );
};

export default GoogleLoginButton;
