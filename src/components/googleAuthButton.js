import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {
    const clientId = "TU_CLIENT_ID";
    const navigate = useNavigate()
    
    const handleSuccess = async (response) => {
        console.log("Inicio de sesión exitoso:", response);
        // Envía el token al backend
        try{ 
        const responsed= await fetch("http://localhost:8000/api/auth/google/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: response }),
        });

        /**
        .then((res) => res.json())
        .then((data) => {
            console.log("Usuario autenticado:", data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
         */
        console.log(responsed.status)
        if (responsed.status === 200) {
            navigate('/');
        }
        } catch (error) {
            console.log(error)
        }
    };

    const handleError = (response) => {
        console.error("Falló el inicio de sesión:", response);
    };

    return (
        <>
            <p>Iniciar Sesión Con Google</p>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
            />
        </>
        
    );
};

export default GoogleLoginButton;