import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const AgendaList = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    emails: "",
    location: "",
    link: "",
    details: { caseId: "" },
    start: null,
    end: null,
  });

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Evento de prueba",
      start: new Date(2025, 1, 20, 10, 0),
      end: new Date(2025, 1, 20, 12, 0),
      emails: "correo@ejemplo.com",
      location: "Sala de reuniones A",
      link: "https://zoom.us",
      details: { caseId: "12345" },
    },
  ]);

  // 📌 Seleccionar un día/hora para crear un evento
  const handleSelectedDay = ({ start, end, box }) => {
    setPopupPosition({ top: box?.y || 200, left: box?.x || 300 });
    setSelectedDay({ start, end });
    setNewEvent({ ...newEvent, start, end });
    setSelectedEvent(null); // Ocultar detalles si se está creando un evento
  };

  // 📌 Mostrar detalles del evento seleccionado
  const handleSelectEvent = (event, { pageX, pageY }) => {
    setSelectedEvent(event);
    setPopupPosition({ top: pageY, left: pageX });
    setSelectedDay(null); // Ocultar el formulario de creación si se selecciona un evento
  };

  // 📌 Guardar cambios en los inputs
  const handleChangeInput = (field, value) => {
    if (field === "details") {
      setNewEvent({
        ...newEvent,
        details: { ...newEvent.details, caseId: value },
      });
    } else {
      setNewEvent({ ...newEvent, [field]: value });
    }
  };

  // 📌 Guardar el evento en el calendario
  const sendEvent = () => {
    if (!newEvent.title.trim()) {
      alert("El evento debe tener un título.");
      return;
    }

    setEvents([...events, { ...newEvent, id: events.length + 1 }]);
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
  };

  // 📌 Redimensionar evento
  const handleEventResize = ({ event, start, end }) => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) => (ev.id === event.id ? { ...ev, start, end } : ev))
    );
  };

  // 📌 Mover evento a otra fecha/hora
  const handleEventDrop = ({ event, start, end }) => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) => (ev.id === event.id ? { ...ev, start, end } : ev))
    );
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
          onSelectEvent={handleSelectEvent} // ✅ Mostrar detalles del evento al hacer clic
          onEventResize={handleEventResize}
          onEventDrop={handleEventDrop}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          style={{ height: "100%" }}
        />

        {/* 📌 Formulario flotante para crear evento */}
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
            <p>Nombre de la Reunión</p>
            <input
              value={newEvent.title}
              onChange={(e) => handleChangeInput("title", e.target.value)}
            />
            <p>Correo electrónico de los asistentes</p>
            <input
              value={newEvent.emails}
              onChange={(e) => handleChangeInput("emails", e.target.value)}
            />
            <p>Lugar de reunión</p>
            <input
              value={newEvent.location}
              onChange={(e) => handleChangeInput("location", e.target.value)}
            />
            <p>Link de reunión</p>
            <input
              value={newEvent.link}
              onChange={(e) => handleChangeInput("link", e.target.value)}
            />
            <p>ID asociado al caso</p>
            <input
              value={newEvent.details.caseId}
              onChange={(e) => handleChangeInput("details", e.target.value)}
            />

            <button
              className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
              onClick={sendEvent}
            >
              Crear reunión
            </button>
            <button
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => setSelectedDay(null)}
            >
              Cerrar
            </button>
          </div>
        )}

        {/* 📌 Detalles del evento seleccionado */}
        {selectedEvent && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow w-1/3">
            <h3 className="text-xl font-bold mb-4">{selectedEvent.title}</h3>
            {selectedEvent.details ? (
              <ul className="space-y-2">
                <li>
                  <strong>Asistentes:</strong> {selectedEvent.emails}
                </li>
                <li>
                  <strong>Link de la reunión:</strong> {selectedEvent.link}
                </li>
                <li>
                  <strong>Lugar de la reunión:</strong>{" "}
                  {selectedEvent.location}
                </li>
                <li>
                  <strong>ID de caso Vinculado:</strong> {selectedEvent.details.caseId}
                </li>
              </ul>
            ) : (
              <p>Detalles no disponibles</p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={()=>setSelectedEvent(!selectedEvent)}
              >
                Cerrar
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default AgendaList;