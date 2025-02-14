import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {
    const clientId = "TU_CLIENT_ID";
    const navigate = useNavigate();

    const handleSuccess = async (response) => {
        console.log("Inicio de sesión exitoso:", response);

        try {
            const responsed = await fetch("http://localhost:8000/api/auth/google/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: { credential: response.credential } }),
            });

            const data = await responsed.json(); // Parsear la respuesta JSON

            if (responsed.ok) {
                // Guardar el token y la información del usuario en localStorage
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userName', data.user.nombre);
                localStorage.setItem('userRole', data.user.rol);
                console.log("Usuario autenticado:", data);

                console.log("name:", data.user.nombre);
                console.log("rol:", data.user.rol);
                navigate('/'); // Navegar a la página de inicio o dashboard
            } else {
                console.log("Error en la autenticación:", data);
                throw new Error('Authentication failed');
            }
        } catch (error) {
            console.error("Error en la conexión o en el proceso de autenticación:", error);
        }
    };

    const handleError = (error) => {
        console.error("Falló el inicio de sesión:", error);
    };

    return (
        <>
            <p>Iniciar Sesión Con Google</p>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                clientId={clientId}
            />
        </>
        
    );
};

export default GoogleLoginButton;