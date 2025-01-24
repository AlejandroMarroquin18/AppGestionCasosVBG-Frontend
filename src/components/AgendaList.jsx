import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const AgendaList = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Ejemplo de datos para los eventos
  const events = [
    {
      id: 1,
      date: "2024-12-05",
      title: "Asesoría psicológica con Erika Galeano",
      details: {
        name: "Erika Galeano",
        email: "galean.erika@gmail.com",
        location: "Oficina",
        caseId: "347653",
      },
    },
    {
      id: 2,
      date: "2024-12-10",
      title: "Reunión con el equipo de gestión",
      details: {
        name: "Equipo de gestión",
        email: "gestion@vbg.com",
        location: "Sala de reuniones virtual",
        caseId: "123456",
      },
    },
  ];

  // Obtiene los días del mes
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseDetails = () => {
    setSelectedEvent(null);
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + direction));
    setCurrentDate(newDate);
  };

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
    <div><h1 className="text-3xl font-bold mb-6">Agenda</h1></div>
      {/* Encabezado del calendario */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-lg shadow hover:shadow-lg transition duration-300 flex justify-center items-center"
          style={{ width: "40px", height: "40px" }}
          onClick={() => changeMonth(-1)}
        >
          <FiChevronLeft />
        </button>
        <h2 className="text-3xl font-bold text-red-500">
          {currentDate.toLocaleString("es-ES", { month: "long" })} {currentYear}
        </h2>
        <button
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-lg shadow hover:shadow-lg transition duration-300 flex justify-center items-center"
          style={{ width: "40px", height: "40px" }}
          onClick={() => changeMonth(1)}
        >
          <FiChevronRight />
        </button>
      </div>

      {/* Contenedor del calendario */}
      <div className="grid grid-cols-7 gap-4 bg-white p-4 rounded shadow">
        {/* Encabezados de los días */}
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}

        {/* Días vacíos al inicio */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="p-4"></div>
        ))}

        {/* Días del mes */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const formattedDate = `${currentYear}-${(currentMonth + 1)
            .toString()
            .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
          const event = events.find((e) => e.date === formattedDate);

          return (
            <div
              key={day}
              className={`p-4 border rounded ${
                event ? "bg-green-100 hover:bg-green-200 cursor-pointer" : ""
              }`}
              onClick={() => event && handleEventClick(event)}
            >
              <div className="text-center font-semibold">{day}</div>
              {event && (
                <div className="mt-2 text-xs text-center bg-green-500 text-white rounded px-2">
                  {event.title}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detalles del evento */}
      {selectedEvent && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow w-1/3">
            <h3 className="text-xl font-bold mb-4">{selectedEvent.title}</h3>
            {selectedEvent.details ? (
              <ul className="space-y-2">
                <li>
                  <strong>Nombre:</strong> {selectedEvent.details.name}
                </li>
                <li>
                  <strong>Correo electrónico:</strong> {selectedEvent.details.email}
                </li>
                <li>
                  <strong>Lugar o Link de reunión:</strong>{" "}
                  {selectedEvent.details.location}
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
                onClick={handleCloseDetails}
              >
                Cerrar
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaList;