import React from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {
    const navigate = useNavigate();

    const login = useGoogleLogin({
        flow: "auth-code",  //  Usar flujo de autorización basado en código
        ux_mode: "popup",
        onSuccess: async (codeResponse) => {
            console.log("Código recibido:", codeResponse);
    
            try {
                const response = await fetch("http://localhost:8000/api/auth/google/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: codeResponse.code }), // 🔥 Enviar "code", no access_token
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    const expiresIn = 3500 * 1000; // 1 hora en milisegundos
                    const expirationTime = new Date().getTime() + expiresIn;

                    localStorage.setItem("userToken", data.token);
                    localStorage.setItem("refreshToken", data.refresh_token);
                    localStorage.setItem("accessToken", data.access_token);
                    localStorage.setItem("userName", data.user.nombre);
                    localStorage.setItem("userRole", data.user.rol);
                    localStorage.setItem("userEmail", data.user.email);
                    localStorage.setItem("tokenExpiration", expirationTime);
    
                    console.log("Usuario autenticado:", data);
                    navigate("/");
                } else {
                    console.log("Error en la autenticación:", data);
                }
            } catch (error) {
                console.error("Error en la conexión:", error);
            }
        },
        onError: (error) => console.error("Error en login:", error),
        scope: "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly",
        access_type: "offline",  // Necesario para obtener refresh_token
        prompt: "consent",       // Obligará a Google a pedir permiso de nuevo
    });

    return (
        <div style={{ textAlign: "center", margin: "20px" }}>
            <p style={{ marginBottom: "10px" }}>Iniciar Sesión Con Google</p>
            <button onClick={login} style={{ fontSize: "16px", fontWeight: "bold", padding: "10px", cursor: "pointer" }}>
                Iniciar con Google
            </button>
        </div>
    );
};

export default GoogleLoginButton;
