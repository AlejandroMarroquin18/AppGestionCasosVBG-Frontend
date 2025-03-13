import { useState } from "react";

const useGoogleCalendar = (accessToken) => {
    const [events, setEvents] = useState([]);
    const API_URL = "https://www.googleapis.com/calendar/v3";
    const userEmail = localStorage.getItem("userEmail");

    //  Obtener eventos del calendario
    const fetchEvents = async (year) => {
        if (!accessToken || !year) return;
    
        let allEvents = [];
        let nextPageToken = null;
    
        // Definir el rango de fechas del año dado
        const timeMin = new Date(`${year}-01-01T00:00:00Z`).toISOString();
        const timeMax = new Date(`${year}-12-31T23:59:59Z`).toISOString();
    
        try {
            do {
                const url = new URL(`${API_URL}/calendars/primary/events`);
                url.searchParams.append("maxResults", "250");
                url.searchParams.append("orderBy", "startTime");
                url.searchParams.append("singleEvents", "true");
                url.searchParams.append("timeMin", timeMin);
                url.searchParams.append("timeMax", timeMax);
                if (nextPageToken) url.searchParams.append("pageToken", nextPageToken);
    
                const response = await fetch(url, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
    
                const data = await response.json();
                if (data.items) {
                    const filteredEvents = data.items;
                    allEvents = [...allEvents, ...filteredEvents];
                }
    
                nextPageToken = data.nextPageToken;
            } while (nextPageToken);
    
            setEvents(allEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };
    

    //  Crear un evento en Google Calendar
    const createEvent = async (eventData) => {
        try {
            const response = await fetch(`${API_URL}/calendars/primary/events`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventData),
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log("Evento creado:", data);
                fetchEvents(); // Recargar eventos
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
            const response = await fetch(`${API_URL}/calendars/primary/events/${eventId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
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
            const response = await fetch(`${API_URL}/calendars/primary/events/${eventId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                console.log("Evento eliminado");
                fetchEvents(); // Recargar eventos
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
            const response = await fetch(`${API_URL}/calendars/primary/events/${eventId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${accessToken}` },
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

