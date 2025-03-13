import React from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log("Tokens recibidos:", tokenResponse);

            try {
                const responsed = await fetch("http://localhost:8000/api/auth/google/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: tokenResponse.access_token, //  Se envía access_token en lugar de credential
                    }),
                });

                const data = await responsed.json();

                if (responsed.ok) {
                    localStorage.setItem("userToken", data.token); // Token de Django
                    localStorage.setItem("accessToken", data.access_token); // Access Token de Google
                    localStorage.setItem("userName", data.user.nombre);
                    localStorage.setItem("userRole", data.user.rol);
                    localStorage.setItem("userEmail",data.user.email)

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
        scope: "https://www.googleapis.com/auth/calendar", // 🔥 Agregar permisos para Google Calendar
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
