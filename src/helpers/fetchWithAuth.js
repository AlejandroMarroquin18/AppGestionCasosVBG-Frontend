import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../api";

/**
export const fetchWithAuth = async (url, options = {}) => {
    const navigate = useNavigate();

    const token = localStorage.getItem("accessToken");

    // Añadir el token a los headers si está disponible
    const headers = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers,
    };

    try {
        const response = await fetch(`${baseURL}`, { ...options, headers });

        if (response.status === 401) {
            console.warn("Token vencido. Cerrando sesión...");
            handleLogout(navigate);
        }

        return response;
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return { ok: false };
    }
};

const handleLogout = (navigate) => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    
    navigate("/login");
};

*/

const useAuthCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = () => {
            const expiration = localStorage.getItem("tokenExpiration");
            if (expiration && new Date().getTime() > expiration) {
                console.warn("Token expirado, cerrando sesión...");
                localStorage.clear();
                navigate("/login");
            }
        };

        const interval = setInterval(checkToken, 10000); // Verificar cada 10 segundos
        return () => clearInterval(interval);
    }, [navigate]);
};

export default useAuthCheck;