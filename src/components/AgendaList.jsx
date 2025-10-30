import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import useGoogleCalendar from "../hooks/useGoogleCalendar";
import 'moment/locale/es'
import { saveEvent, baseURL } from "../api";
import { FiPlus, FiX, FiTrash2, FiEdit, FiSave, FiUsers, FiMapPin, FiLink, FiFileText, FiUser, FiCalendar } from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";

moment.locale('es')
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const AgendaList = () => {
  const userToken = localStorage.getItem("userToken");
  const { events, fetchEvents, createEvent, updateEvent, deleteEvent, fetchEventById } = useGoogleCalendar(userToken);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventCopy, setSelectedEventCopy] = useState(null);
  const [editEventModal, setEditEventModal] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const calendarRef = React.useRef();

  const emptyEvent = {
    title: "",
    tempemail: "",
    emails: [],
    location: "",
    link: "",
    createMeet: false,
    caseID: "",
    description: "",
    organizer: "",
    type: "",
    start: null,
    end: null,
    colorId: "11",
  };

  const [newEvent, setNewEvent] = useState(emptyEvent);
  const [formattedEvents, setFormattedEvents] = useState([]);

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

  // Nombres de colores en forma de oración
  const colorNames = {
    "1": "Azul lavanda claro",
    "2": "Verde menta suave",
    "3": "Lila pastel",
    "4": "Coral rojizo",
    "5": "Amarillo mostaza",
    "6": "Naranja melocotón",
    "7": "Turquesa brillante",
    "8": "Gris neutro",
    "9": "Azul royal",
    "10": "Verde manzana",
    "11": "Rojo intenso"
  };

  const messages = {
    today: 'Hoy',
    previous: 'Anterior',
    next: 'Siguiente',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango.',
    showMore: total => `+ Ver más (${total})`
  };

  useEffect(() => {
    if (userToken) {
      setIsLoading(true);
      fetchEvents(currentYear).finally(() => setIsLoading(false));
    }
  }, [userToken, currentYear]);

  useEffect(() => {
    if (events && events.length > 0) {
      const formatted = events.map(event => {
        const desc = event.description ?? "";
        const casoId = desc.match(/ID caso: \s*(.+) \n \n/);
        const organizador = desc.match(/Organizador: \s*(.+) \n \n/);
        const tipo = desc.match(/Tipo: \s*(.+)/);
        const descripcion = desc.match(/description: \s*(.+) \n \n/);

        return {
          id: event.id,
          title: event.summary,
          start: event.start?.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date),
          end: event.end?.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date),
          emails: event.attendees ? event.attendees.map(a => a.email) : [],
          location: event.location || "Sin ubicación",
          link: event.hangoutLink || "",
          colorId: event.colorId,
          caseID: casoId?.[1]?.trim() ?? "",
          organizer: organizador?.[1]?.trim() ?? "",
          type: tipo?.[1]?.trim() ?? "",
          description: descripcion?.[1]?.trim() ?? "",
        };
      });
      setFormattedEvents(formatted);
    }
  }, [events]);

  const handleSelectedDay = ({ start, end, box }) => {
    const calendarRect = calendarRef.current.getBoundingClientRect();
    const relativeX = box?.clientX - calendarRect.left;
    const relativeY = box?.clientY - calendarRect.top;

    setSelectedDay({ start, end });
    setNewEvent({ ...emptyEvent, start, end });
    setSelectedEvent(null);
  };

  const handleSelectEvent = (event) => {
    setSelectedEventCopy({ ...event });
    setSelectedEvent({ ...event });
    setSelectedDay(null);
  };

  const handleChangeInput = (func, vare, field, value) => {
    if (field === "caseID") {
      func({ ...vare, caseID: value });
    } else {
      func({ ...vare, [field]: value });
    }
  };

  const addEmail = () => {
    if (newEvent.tempemail.trim()) {
      setNewEvent({
        ...newEvent,
        emails: [...newEvent.emails, newEvent.tempemail.trim()],
        tempemail: ""
      });
    }
  };

  const removeEmail = (emailToRemove) => {
    setNewEvent({
      ...newEvent,
      emails: newEvent.emails.filter(email => email !== emailToRemove)
    });
  };

  const sendEvent = async () => {
    if (!newEvent.title.trim()) {
      alert("El evento debe tener un título.");
      return;
    }

    // Validar ID de caso
    const resCaseID = await fetch(`${baseURL}/quejas/validarquejaid/${newEvent.caseID}/`);
    const dataCaseID = await resCaseID.json();

    if (!dataCaseID.exists) {
      alert("El ID de la queja no existe en el sistema.");
      return;
    }

    const eventData = {
      summary: newEvent.title,
      location: newEvent.location,
      description: `ID caso: ${newEvent.caseID} \n Organizador: ${newEvent.organizer} \n Tipo: ${newEvent.type} \n description: ${newEvent.description} \n`,
      attendees: newEvent.emails.map((email) => ({ email: email.trim() })),
      start: { dateTime: newEvent.start.toISOString(), timeZone: "America/Bogota" },
      end: { dateTime: newEvent.end.toISOString(), timeZone: "America/Bogota" },
      colorId: newEvent.colorId,
      ...(newEvent.createMeet && {
        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),
            conferenceSolutionKey: { type: "hangoutsMeet" }
          }
        }
      })
    };

    const backendEvent = {
      title: newEvent.title,
      description: newEvent.description,
      status: "confirmed",
      location: newEvent.location,
      attendes: newEvent.emails,
      color: newEvent.colorId,
      organizer: newEvent.organizer,
      startdatehour: newEvent.start.toISOString(),
      enddatehour: newEvent.end.toISOString(),
      timezone: "America/Bogota",
      type: newEvent.type,
      case_id: newEvent.caseID,
      create_meet: newEvent.createMeet,
      meet_link: "",
      google_event_id: ""
    };

    try {
      const createdEvent = await createEvent(eventData);

      setFormattedEvents(prevEvents => [
        ...prevEvents,
        {
          id: createdEvent.id,
          title: createdEvent.summary,
          start: new Date(createdEvent.start.dateTime),
          end: new Date(createdEvent.end.dateTime),
          emails: createdEvent.attendees ? createdEvent.attendees.map(a => a.email) : [],
          location: createdEvent.location || "Sin ubicación",
          link: createdEvent.hangoutLink || "",
          colorId: createdEvent.colorId || "11",
          caseID: newEvent.caseID,
          organizer: newEvent.organizer,
          type: newEvent.type,
          description: newEvent.description,
        }
      ]);

      backendEvent.google_event_id = createdEvent.id;
      backendEvent.meet_link = createdEvent.hangoutLink || "";
      await saveEvent(backendEvent);

      setSelectedDay(null);
      setNewEvent(emptyEvent);

    } catch (error) {
      console.error("Error al crear el evento:", error);
      alert("No se pudo crear el evento. Inténtalo de nuevo.");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!eventId) return;

    if (!window.confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      return;
    }

    try {
      await deleteEvent(eventId);
      setFormattedEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      alert("No se pudo eliminar el evento. Inténtalo de nuevo.");
    }
  };

  const getEventStyle = (event) => {
    const backgroundColor = eventColors[event.colorId] || "#3174ad";
    return {
      style: {
        backgroundColor,
        color: "#000",
        border: "none",
        borderRadius: "4px",
        fontSize: "12px",
      }
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner message="Cargando agenda..." size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📅 Agenda de eventos
          </h1>
          <p className="text-gray-600 text-sm">
            Gestiona y programa tus reuniones y eventos
          </p>
          <div className="w-20 h-1 bg-red-600 rounded-full mt-2"></div>
        </div>

        {/* Calendar Container */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <div ref={calendarRef} style={{ height: "70vh", position: "relative" }}>
            <DnDCalendar
              selectable
              resizable
              draggableAccessor={() => true}
              resizableAccessor={() => true}
              messages={messages}
              onSelectSlot={handleSelectedDay}
              onSelectEvent={handleSelectEvent}
              localizer={localizer}
              events={formattedEvents}
              startAccessor="start"
              endAccessor="end"
              defaultView="week"
              style={{ height: "100%" }}
              eventPropGetter={getEventStyle}
            />
          </div>
        </div>

        {/* Modal para crear evento */}
        {selectedDay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">➕ Crear nuevo evento</h3>
                  <button
                    onClick={() => { setSelectedDay(null); setNewEvent(emptyEvent); }}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del evento *
                    </label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => handleChangeInput(setNewEvent, newEvent, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      placeholder="Ingresa el título del evento"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID de caso *
                    </label>
                    <input
                      type="text"
                      value={newEvent.caseID}
                      onChange={(e) => handleChangeInput(setNewEvent, newEvent, "caseID", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      placeholder="ID de la queja relacionada"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMapPin className="inline mr-1" />
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => handleChangeInput(setNewEvent, newEvent, "location", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      placeholder="Lugar del evento"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiUser className="inline mr-1" />
                      Organizador
                    </label>
                    <input
                      type="text"
                      value={newEvent.organizer}
                      onChange={(e) => handleChangeInput(setNewEvent, newEvent, "organizer", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      placeholder="Nombre del organizador"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUsers className="inline mr-1" />
                    Participantes
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="email"
                      value={newEvent.tempemail}
                      onChange={(e) => handleChangeInput(setNewEvent, newEvent, "tempemail", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addEmail()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      placeholder="Correo del participante"
                    />
                    <button
                      onClick={addEmail}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  {newEvent.emails.length > 0 && (
                    <div className="space-y-1">
                      {newEvent.emails.map((email, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded text-sm">
                          <span>{email}</span>
                          <button
                            onClick={() => removeEmail(email)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de evento
                    </label>
                    <input
                      type="text"
                      value={newEvent.type}
                      onChange={(e) => handleChangeInput(setNewEvent, newEvent, "type", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      placeholder="Tipo de reunión"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color del evento
                    </label>
                    <select
                      value={newEvent.colorId}
                      onChange={(e) => {
                        e.stopPropagation(); // Detiene la propagación del evento
                        handleChangeInput(setNewEvent, newEvent, "colorId", e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      style={{
                        backgroundColor: eventColors[newEvent.colorId],
                        color: '#000'
                      }}
                    >
                      {Object.entries(eventColors).map(([key, color]) => (
                        <option key={key} value={key} style={{
                          backgroundColor: color,
                          color: '#000',
                          padding: '8px'
                        }}>
                          {colorNames[key]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiFileText className="inline mr-1" />
                    Descripción
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => handleChangeInput(setNewEvent, newEvent, "description", e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
                    placeholder="Descripción del evento"
                  />
                </div>

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    checked={newEvent.createMeet}
                    onChange={(e) => handleChangeInput(setNewEvent, newEvent, "createMeet", e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Crear reunión de Google Meet
                  </label>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => { setSelectedDay(null); setNewEvent(emptyEvent); }}
                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={sendEvent}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm"
                  >
                    Crear evento
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal para detalles del evento */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">📅 Detalles del evento</h3>
                  <button
                    onClick={() => { setSelectedEvent(null); setEditEventModal(false); }}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                      {!editEventModal ? (
                        <p className="text-gray-900">{selectedEvent.title}</p>
                      ) : (
                        <input
                          type="text"
                          value={selectedEvent.title}
                          onChange={(e) => handleChangeInput(setSelectedEvent, selectedEvent, "title", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiMapPin className="inline mr-1" />
                        Ubicación
                      </label>
                      {!editEventModal ? (
                        <p className="text-gray-900">{selectedEvent.location || "No especificado"}</p>
                      ) : (
                        <input
                          type="text"
                          value={selectedEvent.location}
                          onChange={(e) => handleChangeInput(setSelectedEvent, selectedEvent, "location", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID de caso</label>
                      {!editEventModal ? (
                        <p className="text-gray-900">{selectedEvent.caseID || "No especificado"}</p>
                      ) : (
                        <input
                          type="text"
                          value={selectedEvent.caseID}
                          onChange={(e) => handleChangeInput(setSelectedEvent, selectedEvent, "caseID", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiUser className="inline mr-1" />
                        Organizador
                      </label>
                      {!editEventModal ? (
                        <p className="text-gray-900">{selectedEvent.organizer || "No especificado"}</p>
                      ) : (
                        <input
                          type="text"
                          value={selectedEvent.organizer}
                          onChange={(e) => handleChangeInput(setSelectedEvent, selectedEvent, "organizer", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                      {!editEventModal ? (
                        <p className="text-gray-900">{selectedEvent.type || "No especificado"}</p>
                      ) : (
                        <input
                          type="text"
                          value={selectedEvent.type}
                          onChange={(e) => handleChangeInput(setSelectedEvent, selectedEvent, "type", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      {!editEventModal ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: eventColors[selectedEvent.colorId] }}
                          ></div>
                          <span className="text-gray-900">{colorNames[selectedEvent.colorId]}</span>
                        </div>
                      ) : (
                        <select
                          value={selectedEvent?.colorId || "11"}
                          onChange={(e) => {
                            e.stopPropagation(); // Detiene la propagación del evento
                            handleChangeInput(setSelectedEvent, selectedEvent, "colorId", e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                          style={{
                            backgroundColor: eventColors[selectedEvent?.colorId] || eventColors["11"],
                            color: '#000'
                          }}
                        >
                          {Object.entries(eventColors).map(([key, color]) => (
                            <option key={key} value={key} style={{
                              backgroundColor: color,
                              color: '#000',
                              padding: '8px'
                            }}>
                              {colorNames[key]}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUsers className="inline mr-1" />
                    Participantes
                  </label>
                  {selectedEvent.emails && selectedEvent.emails.length > 0 ? (
                    <div className="space-y-1">
                      {selectedEvent.emails.map((email, index) => (
                        <div key={index} className="bg-gray-50 px-3 py-2 rounded text-sm">
                          {email}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No hay participantes</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiFileText className="inline mr-1" />
                    Descripción
                  </label>
                  {!editEventModal ? (
                    <p className="text-gray-900">{selectedEvent.description || "No hay descripción"}</p>
                  ) : (
                    <textarea
                      value={selectedEvent.description}
                      onChange={(e) => handleChangeInput(setSelectedEvent, selectedEvent, "description", e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
                    />
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm"
                  >
                    <FiTrash2 size={14} />
                    Eliminar
                  </button>
                  {editEventModal ? (
                    <>
                      <button
                        onClick={() => { setSelectedEvent(selectedEventCopy); setEditEventModal(false); }}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => { /* handleEditSaveEvent(selectedEvent); */ setEditEventModal(false); }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm"
                      >
                        <FiSave size={14} />
                        Guardar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditEventModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm"
                    >
                      <FiEdit size={14} />
                      Editar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaList;