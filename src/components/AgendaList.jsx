import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import useGoogleCalendar from "../hooks/useGoogleCalendar";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const AgendaList = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { events, fetchEvents, createEvent, updateEvent, deleteEvent,fetchEventById } = useGoogleCalendar(accessToken);
  const [selectedDay, setSelectedDay] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [visualevents,setVisualEvents]=useState([])
  const [newEvent, setNewEvent] = useState({
    title: "",
    emails: "",
    location: "",
    link: "",
    details: { caseId: "" },
    start: null,
    end: null,
  });
  const [eventoooos, setEventoooos] = useState([
    {
      title: "Evento de prueba",
      start: new Date(2025, 2, 4, 10, 0),
      end: new Date(2025, 2, 4, 12, 0),
      emails: "correo@ejemplo.com",
      location: "Sala de reuniones A",
      link: "https://zoom.us",
      details: { caseId: "12345" },
    },
  ]);


  

  useEffect(() => {
    if (accessToken) {
      fetchEvents(2025);
    }
  }, [accessToken]);


  useEffect(() => {
    if (events && events.length > 0) {
      const formatted = events.map(event => ({
        id: event.id,
        title: event.summary ,
        start: event.start?.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date), // Soporte para eventos de día completo
        end: event.end?.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date),
        emails: event.attendees ? event.attendees.map(a => a.email).join(", ") : "",
        location: event.location || "Sin ubicación",
        link: event.hangoutLink || "",
        details: { caseId: event.description ? event.description.replace("Caso ID: ", "") : "" }
      }));
  
      setEventoooos(formatted);
    }
  }, [events]);

  //  Seleccionar una fecha/hora para crear un evento
  const handleSelectedDay = ({ start, end, box }) => {
    setPopupPosition({ top: box?.y || 200, left: box?.x || 300 });
    setSelectedDay({ start, end });
    setNewEvent({ ...newEvent, start, end });
    setSelectedEvent(null);
  };

  //  Mostrar detalles del evento
  const handleSelectEvent = (event, { pageX, pageY }) => {
    setSelectedEvent(event);
    console.log(selectedEvent)
    setPopupPosition({ top: pageY, left: pageX });
    setSelectedDay(null);
  };

  //  Guardar cambios en inputs
  const handleChangeInput = (field, value) => {
    if (field === "details") {
      setNewEvent({ ...newEvent, details: { ...newEvent.details, caseId: value } });
    } else {
      setNewEvent({ ...newEvent, [field]: value });
    }
  };

  //  Crear evento en Google Calendar
  const sendEvent = async () => {
    if (!newEvent.title.trim()) {
      alert("El evento debe tener un título.");
      return;
    }
  
    const eventData = {
      summary: newEvent.title,
      location: newEvent.location,
      description: `Caso ID: ${newEvent.details.caseId}`,
      attendees: newEvent.emails ? newEvent.emails.split(",").map((email) => ({ email: email.trim() })) : [],
      start: { dateTime: newEvent.start.toISOString(), timeZone: "America/Bogota" },
      end: { dateTime: newEvent.end.toISOString(), timeZone: "America/Bogota" },
    };
  
    try {
      const createdEvent = await createEvent(eventData); // Esperar a que el evento se cree en Google Calendar
  
      // Si la creación fue exitosa, actualizar el estado con el nuevo evento
      setEventoooos(prevEvents => [
        ...prevEvents,
        {
          id: createdEvent.id, // Agregar el ID devuelto por la API
          title: createdEvent.summary,
          start: new Date(createdEvent.start.dateTime),
          end: new Date(createdEvent.end.dateTime),
          emails: createdEvent.attendees ? createdEvent.attendees.map(a => a.email).join(", ") : "",
          location: createdEvent.location || "Sin ubicación",
          link: createdEvent.hangoutLink || "",
          details: { caseId: createdEvent.description?.replace("Caso ID: ", "") || "" },
        }
      ]);
  
      setSelectedDay(null);
      setNewEvent({
        title: "",
        emails: "",
        location: "",
        link: "",
        details: { caseId: "" },
        start: null,
        end: null,
      });
  
    } catch (error) {
      console.error("Error al crear el evento:", error);
      alert("No se pudo crear el evento. Inténtalo de nuevo.");
    }
  };

  //  Redimensionar evento
  const handleEventResize = async ({ event, start, end }) => {
    const id = event.id;
    const oldevent = { ...event }; // Hacer una copia del evento original
    const eventEquivalent = events.find(item => item.id === id);
    console.log(eventEquivalent)
    // Actualizar el estado de los eventos antes de llamar a la API
    setEventoooos((prevEvents) =>
      prevEvents.map((ev) => (ev.id === id ? { ...ev, start, end } : ev))
    );
  
    try {
      // Llamar a la API para actualizar el evento en Google Calendar
      const response = await updateEvent(id, {
        ...eventEquivalent,
        start: { dateTime: start.toISOString(), timeZone : Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: { dateTime: end.toISOString(), timeZone : Intl.DateTimeFormat().resolvedOptions().timeZone  }
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar el evento");
      }
  
    } catch (error) {
      console.error("Error actualizando el evento:", error);
  
      // Restaurar el evento original si la actualización falla
      setEventoooos((prevEvents) =>
        prevEvents.map((ev) => (ev.id === id ? oldevent : ev))
      );
    }
  };

  const handleDeleteEvent= async (eventId)=>{

    if (!eventId) return;
    
    try {
      await deleteEvent(eventId); // Intentar eliminar el evento en Google Calendar
    
      // Si la eliminación fue exitosa, actualizar el estado
      setEventoooos(prevEvents => prevEvents.filter(event => event.id !== eventId));
      setSelectedEvent(null)
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      alert("No se pudo eliminar el evento. Inténtalo de nuevo.");
    }
  

  };

  //  Mover evento
  const handleEventDrop = ({ event, start, end }) => {
    updateEvent(event.id, { start: { dateTime: start.toISOString() }, end: { dateTime: end.toISOString() } });
  };

  return (
    <>
      <div style={{ height: "80vh", position: "relative" }}>
        <DnDCalendar
          selectable
          resizable
          draggableAccessor={() => true}
          resizableAccessor={() => true}
          onSelectSlot={handleSelectedDay}
          onSelectEvent={handleSelectEvent}
          onEventResize={handleEventResize}
          onEventDrop={handleEventResize}
          localizer={localizer}
          events={eventoooos}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          style={{ height: "100%" }}
        />

        {/* Formulario flotante para crear evento */}
        {selectedDay && (
          <div
            style={{
              position: "absolute",
              top: popupPosition.top,
              left: popupPosition.left,
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              padding: "10px",
              zIndex: 100,
            }}
          >
            <h4>Crear Reunión</h4>
            <input value={newEvent.title} onChange={(e) => handleChangeInput("title", e.target.value)} placeholder="Título" />
            <input value={newEvent.emails} onChange={(e) => handleChangeInput("emails", e.target.value)} placeholder="Correos (separados por coma)" />
            <input value={newEvent.location} onChange={(e) => handleChangeInput("location", e.target.value)} placeholder="Ubicación" />
            <input value={newEvent.link} onChange={(e) => handleChangeInput("link", e.target.value)} placeholder="Enlace de reunión" />
            <input value={newEvent.details.caseId} onChange={(e) => handleChangeInput("details", e.target.value)} placeholder="ID de caso" />

            <button onClick={sendEvent}>Crear</button>
            <button onClick={() => setSelectedDay(null)}>Cerrar</button>
          </div>
        )}

        {/* Detalles del evento seleccionado */}
        {selectedEvent && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow w-1/3">
              <h3 className="text-xl font-bold mb-4">{selectedEvent.summary}</h3>
              <ul>
                <li><strong>Ubicación:</strong> {selectedEvent.location || "N/A"}</li>
                <li><strong>Asistentes:</strong> {selectedEvent.attendees ? selectedEvent.attendees.map(a => a.email).join(", ") : "N/A"}</li>
                <li><strong>Enlace:</strong> {selectedEvent.hangoutLink || "N/A"}</li>
                <li><strong>ID de Caso:</strong> {selectedEvent.description?.replace("Caso ID: ", "") || "N/A"}</li>
              </ul>
              <button onClick={() => {handleDeleteEvent(selectedEvent.id)}}>Eliminar</button>
              <button onClick={() => setSelectedEvent(null)}>Cerrar</button>
            </div>
          </div>
        )}
        
      </div>
    </>
  );
};

export default AgendaList;
