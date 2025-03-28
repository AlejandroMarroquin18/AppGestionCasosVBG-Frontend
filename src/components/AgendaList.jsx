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
  const [selectedEventCopy,setSelectedEventCopy]=useState(null)
  const [editEventModal, setEditEventModal] = useState(false);
  
  
  const emptyEvent={
    title: "",
    tempemail:"",
    emails: [],
    location: "",
    link: "",
    createMeet:false,
    details: { caseId: "" },
    start: null,
    end: null,
    colorId: "11",
  }
  const [newEvent, setNewEvent] = useState(emptyEvent);


  const [eventoooos, setEventoooos] = useState([
    {
      title: "Evento de prueba",
      start: new Date(2025, 2, 4, 10, 0),
      end: new Date(2025, 2, 4, 12, 0),
      emails: ["correo@ejemplo.com"],
      location: "Sala de reuniones A",
      link: "https://zoom.us",
      details: { caseId: "12345" },
    },
  ]);
  const eventColors = {
    "1": "#a4bdfc",
    "2": "#7ae7bf",
    "3": "#dbadff",
    "4": "#ff887c",
    "5": "#fbd75b",
    "6": "#ffb878",
    "7": "#46d6db",
    "8": "#e1e1e1",
    "9": "#5484ed",
    "10": "#51b749",
    "11": "#dc2127"
  };


  

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
        emails: event.attendees ? event.attendees.map(a => a.email) : [],
        location: event.location || "Sin ubicación",
        link: event.hangoutLink || "",
        details: { caseId: event.description ? event.description.replace("Caso ID: ", "") : "" },
        colorId : event.colorId
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
  const handleSelectEvent = (event) => {
    setSelectedEventCopy(event)
    setSelectedEvent(event);
    //setPopupPosition({ top: pageY, left: pageX });
    setSelectedDay(null);
  };

  //  Guardar cambios en inputs
  const handleChangeInput = (func,vare,field, value) => {
    if (field === "details") {
      func({ ...vare, details: { ...vare.details, caseId: value } });
    } else {
      func({ ...vare, [field]: value });
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
      attendees: newEvent.emails ? newEvent.emails.map((email) => ({ email: email.trim() })) : [],/////////////
      start: { dateTime: newEvent.start.toISOString(), timeZone: "America/Bogota" },
      end: { dateTime: newEvent.end.toISOString(), timeZone: "America/Bogota" },
      colorId: newEvent.colorId,
      ...(newEvent.createMeet && {
        conferenceData: {
            createRequest: {
                requestId: crypto.randomUUID(), // ID único obligatorio
                conferenceSolutionKey: { type: "hangoutsMeet" }
            }
        }
      })
      
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
          emails: createdEvent.attendees ? createdEvent.attendees.map(a => a.email) : [],////////////////////
          location: createdEvent.location || "Sin ubicación",
          link: createdEvent.hangoutLink || "",
          //alternativa a link

          details: { caseId: createdEvent.description?.replace("Caso ID: ", "") || "" },
          colorId: createdEvent.colorId || "11",
          
        }
      ]);
  
      setSelectedDay(null);
      setNewEvent({
        title: "",
        emails: [],//////////////////////////////////////////////////////cambio
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
    
    // Actualizar el estado de los eventos antes de llamar a la API
    setEventoooos((prevEvents) =>
      prevEvents.map((ev) => (ev.id === id ? { ...ev, start, end } : ev))
    );
  
    try {
      const eventEquivalent = await fetchEventById(id)
      console.log(eventEquivalent)
      
      // Llamar a la API para actualizar el evento en Google Calendar
      const response = await updateEvent(id, {
        ...eventEquivalent,
        sequence: eventEquivalent.sequence,
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

  const handleEditEvent = ( event) => {
    
  };


  const getEventStyle = (event) => {
    const backgroundColor = eventColors[event.colorId] || "#3174ad"; 
    //const backgroundColor = event.colorId || "#3174ad";
    return {
      style: {
        backgroundColor,
        color: "#000", 
        border: "none",
      }
    };
  }
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
          eventPropGetter={getEventStyle}
        />

        {/* Formulario flotante para crear evento */}
        {selectedDay && (
          <div className={`absolute 
           bg-white border border-gray-300 rounded-lg shadow-md p-2 z-[100] justify-around flex flex-col gap-2 w-1/3 h-auto`}
            style={{
              top: popupPosition.top,
              left: popupPosition.left, 
            }}
          >
            <h4><strong>Crear Reunión</strong></h4>
            <input value={newEvent.title} onChange={(e) => handleChangeInput(setNewEvent,newEvent,"title", e.target.value)} placeholder="Título" />
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <input 
                onKeyDown={(e) => e.key === "Enter" &&  newEvent.tempemail.trim() && setNewEvent({...newEvent , emails : [...newEvent.emails,newEvent.tempemail], tempemail: ""}) }
                value={newEvent.tempemail} onChange={(e) => handleChangeInput(setNewEvent,newEvent,"tempemail", e.target.value)} 
                placeholder="Añadir participante" />
                <button onClick={()=> newEvent.tempemail.trim() && setNewEvent({...newEvent , emails : [...newEvent.emails,newEvent.tempemail], tempemail: ""}) }> 
                  Añadir 
                </button>
              </div>
              <div>
                <ul className="w-full">
                  {newEvent.emails.map((email, index) => (
                    <li key={index} className="flex justify-between items-center gap-2 w-full border-b py-2">
                      <span>{email}</span>
                      <button className="px-2 py-1" onClick={() => handleChangeInput(setNewEvent,newEvent,"emails", newEvent.emails.filter((e) => e !== email) )}>
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>  
            </div>


            {/*Check de crear reunion */}
            <h4><strong>Crear Reunión de Google Meet?</strong></h4>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={newEvent.createMeet}
                onChange={(e) => handleChangeInput(setNewEvent,newEvent,"createMeet",e.target.checked)}
                className="hidden"
              />
              <div
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  newEvent.createMeet ? "bg-red-500 border-red-500" : "border-gray-400"
                }`}
              />
              <span className="ml-2">{newEvent.createMeet ? "Activado" : "Desactivado"}</span>
            </label>

            <input value={newEvent.location} onChange={(e) => handleChangeInput(setNewEvent,newEvent,"location", e.target.value)} placeholder="Ubicación" />
            
            <input value={newEvent.details.caseId} onChange={(e) => handleChangeInput(setNewEvent,newEvent,"details", e.target.value)} placeholder="ID de caso" />
            {/*Descripcion*/}
            {/**Calendario (?) */}
            {/**color */}
            <select
              value={newEvent.colorId}
              onChange={(e) => handleChangeInput(setNewEvent,newEvent,"colorId",e.target.value)}
              className={`border rounded-lg  appearance-none bg-[${eventColors[newEvent.colorId]}]`}
            >
              <option value="" disabled>Selecciona un color</option>
              {Object.entries(eventColors).map(([key, color]) => (
                <option key={key} value={key} style={{ backgroundColor: color }}>
                  {color}
                </option>
              ))}
            </select>
            <div>
            <button onClick={sendEvent}>Crear</button>
            <button onClick={() =>{ setSelectedDay(null);setNewEvent(emptyEvent)}}>Cerrar</button>
            </div>
          </div>
        )}

        {/* Detalles del evento seleccionado */}
        {selectedEvent && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow w-1/3">
              <h3 className="text-xl font-bold mb-4">{selectedEvent.title}</h3>
              <ul>
                <li><strong> {selectedEvent.title} </strong></li>
                <li></li>
                <li><strong>Ubicación:</strong> {!editEventModal ? (selectedEvent.location || "N/A") : <input value={selectedEvent["location"]} onChange={(e) => handleChangeInput(setSelectedEvent,selectedEvent,"location", e.target.value)} />}</li>
                <li>
                  <strong>Asistentes:</strong>{" "}
                  {selectedEvent.emails && selectedEvent.emails.length > 0 ? (
                    <ul>
                      {selectedEvent.emails.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  ) : (
                    "N/A"
                  )}
                </li>
                <li><strong>Enlace:</strong> {selectedEvent.link || "N/A"}</li>
                <li><strong>Descripcion:</strong> {selectedEvent.details.caseId || "N/A"}
                {!editEventModal ? (selectedEvent.details.caseId || "N/A") : <input value={selectedEvent.details.caseId} onChange={(e) => handleChangeInput(setSelectedEvent,selectedEvent,"details", e.target.value)} />}
                </li>
                
                
              </ul>
              <button onClick={() => {handleDeleteEvent(selectedEvent.id)}}>Eliminar</button>
              {editEventModal && <button onClick={()=>handleEditEvent(selectedEvent)}>Guardar</button>}
              {editEventModal && <button onClick={()=>{setSelectedEvent(selectedEventCopy);setEditEventModal(false)}}>Cancelar</button>}
               <button onClick={()=> setEditEventModal(true)}>Editar</button>
              <button onClick={() =>{setSelectedEvent(null);setEditEventModal(false)}}>Cerrar</button>
            </div>
          </div>
        )}
        
      </div>
    </>
  );
};

export default AgendaList;
