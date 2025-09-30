import { Navigate, Outlet} from "react-router-dom";
import { checkSession } from "../api";
import { useState, useEffect } from "react";

const ProtectedRouteOld = () => {
    const token = localStorage.getItem("accessToken");
    const isAuthenticated = token && new Date().getTime() < localStorage.getItem("tokenExpiration");

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const ProtectedRoute = () => {
    // Estado para saber si el usuario está autenticado.
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // Estado para indicar si la verificación de la sesión ha terminado.
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const verifySession = async () => {
            try {
                const data = await checkSession();
                if (data) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                // Maneja el error, por ejemplo, si la sesión no es válida
                console.error("Error al verificar la sesión:", error);
                setIsAuthenticated(false);
            } finally {
                // Se asegura de que isLoading se establezca en false al finalizar
                setIsLoading(false);
            }
        };

        verifySession();
    }, []);

    // Si aún estamos cargando, no renderizamos nada o un spinner.
    if (isLoading) {
        return <div>Cargando...</div>; 
    }

    // Si la carga ha terminado, ahora sí podemos decidir la ruta.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;