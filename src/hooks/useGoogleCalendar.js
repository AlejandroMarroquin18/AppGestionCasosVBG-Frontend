import { useState } from "react";
import getCSRFToken from "../helpers/getCSRF";

const useGoogleCalendar = (accessToken) => {
    const [events, setEvents] = useState([]);
    const API_URL = "https://www.googleapis.com/calendar/v3";

    //  Obtener eventos del calendario
    const fetchEvents = async (year) => {
        if (!accessToken || !year) return;
    
        let allEvents = [];
        
    
        
        try {

            const response = await fetch(`http://localhost:8000/api/calendar/fetchEvents/${year}`, {
                method: "GET",
                headers: {
                    "Authorization": `Token ${localStorage.getItem("userToken")}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
    
            const data = await response.json();
            if (response.ok) {
                setEvents(data);
            } else {
                console.error("Error al crear evento:", data);
                throw new Error(data.error?.message || "Error desconocido al crear el evento");
            }
            
    
            
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };
    

    //  Crear un evento en Google Calendar
    const createEvent = async (eventData) => {
        try {
            const response = await fetch("http://localhost:8000/api/calendar/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${localStorage.getItem("userToken")}`,
                    "X-CSRFToken": getCSRFToken(), 

                },
                body: JSON.stringify(eventData),
                credentials: "include",
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log("Evento creado:", data);
                //fetchEvents(); // Recargar eventos
                return data; // Devuelve el evento creado
            } else {
                console.error("Error al crear evento:", data);
                throw new Error(data.error?.message || "Error desconocido al crear el evento");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            throw error; // Propagar el error para que el caller lo maneje
        }
    };

    //  Editar un evento existente
    const updateEvent = async (eventId, updatedData) => {
        try {

            const response = await fetch(`http://localhost:8000/api/calendar/update/${eventId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Token ${localStorage.getItem("userToken")}`,
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(), 
                },
                body: JSON.stringify(updatedData),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Evento actualizado:", data);
                //fetchEvents(); // Recargar eventos
                return response
            } else {
                console.error("Error al actualizar evento:", data);
                return response
            }
            
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    //  Eliminar un evento
    const deleteEvent = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/calendar/delete/${eventId}`, {
                method: "DELETE",
                headers: {

                    "Authorization": `Token ${localStorage.getItem("userToken")}`,
                    "X-CSRFToken": getCSRFToken(), 
                },
                credentials: "include",
            });

            if (response.ok) {
                console.log("Evento eliminado");
                //fetchEvents(); // Recargar eventos
                return response
            } else {
                console.error("Error al eliminar evento");
                return response
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    const fetchEventById = async (eventId) => {
        if (!accessToken || !eventId) return null;
    
        try {
            const response = await fetch(`http://localhost:8000/api/calendar/fetchById/${eventId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Authorization": `Token ${localStorage.getItem("userToken")}`,
                    "X-CSRFToken": getCSRFToken(), 
                }
            });
    
            if (!response.ok) {
                console.error("Error al obtener el evento:", response.statusText);
                return null;
            }
    
            const eventData = await response.json();
            return eventData;
        } catch (error) {
            console.error("Error en la solicitud:", error);
            return null;
        }
    };

    return { events, fetchEvents, createEvent, updateEvent, deleteEvent , fetchEventById};
};

export default useGoogleCalendar;

