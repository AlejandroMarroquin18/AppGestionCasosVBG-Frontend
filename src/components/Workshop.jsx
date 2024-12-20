import React, { useState } from "react";
import WorkshopForm from "./WorkshopForm"; 
import WorkshopList from "./WorkshopList";

// Simulamos los talleres de ejemplo
const workshopsData = [
  {
    name: "Taller de Empoderamiento Femenino",
    startTime: "2024-12-20 10:00 AM",
    endTime: "2024-12-20 12:00 PM",
    location: "Centro de Atención a la Mujer - Auditorio Principal",
    mode: "Presencial",
    quota: 30,
    email: "vbg@centromujer.com",
    code: "VBG-101",
    details: "Este taller busca proporcionar herramientas de empoderamiento personal a mujeres víctimas de violencia.",
    status: "Pendiente"
  },
  {
    name: "Prevención de Violencia en el Ámbito Escolar",
    startTime: "2024-12-22 2:00 PM",
    endTime: "2024-12-22 4:00 PM",
    location: "Escuela Secundaria San José",
    mode: "Presencial",
    quota: 50,
    email: "vbg@escuelasjose.edu",
    code: "VBG-102",
    details: "Enseñar a jóvenes y docentes a reconocer y prevenir situaciones de violencia en el entorno escolar.",
    status: "Realizado"
  },
  {
    name: "Asesoría Psicológica para Víctimas de VBG",
    startTime: "2024-12-24 9:00 AM",
    endTime: "2024-12-24 11:00 AM",
    location: "Consultorio de Psicología Comunitaria",
    mode: "Virtual",
    quota: 20,
    email: "psicologia@vbg.com",
    code: "VBG-103",
    details: "Sesiones virtuales de asesoría psicológica para mujeres víctimas de violencia basada en género.",
    status: "Pendiente"
  },
  {
    name: "Manejo del Estrés Post-Traumático por Violencia de Género",
    startTime: "2024-12-25 3:00 PM",
    endTime: "2024-12-25 5:00 PM",
    location: "Centro de Rehabilitación Mujer y Familia",
    mode: "Presencial",
    quota: 15,
    email: "contacto@rehabilitacionmujer.org",
    code: "VBG-104",
    details: "Taller práctico para ayudar a las víctimas de VBG a manejar los efectos del estrés post-traumático.",
    status: "Pendiente"
  },
  {
    name: "Leyes de Protección a las Víctimas de Violencia de Género",
    startTime: "2024-12-27 11:00 AM",
    endTime: "2024-12-27 1:00 PM",
    location: "Auditorio Legal - Sede Central",
    mode: "Virtual",
    quota: 40,
    email: "legales@vbgprotection.org",
    code: "VBG-105",
    details: "Taller sobre los derechos legales y las leyes que protegen a las víctimas de violencia basada en género.",
    status: "Realizado"
  }
];

const Workshop = () => {
  const [showForm, setShowForm] = useState(false);
  const [showWorkshops, setShowWorkshops] = useState(false);
  const [workshops, setWorkshops] = useState(workshopsData);

  const handleCreateWorkshop = () => {
    setShowForm(true);
    setShowWorkshops(false); // Ocultar la lista de talleres cuando se crea uno nuevo
  };

  const handleViewWorkshops = () => {
    setShowForm(false);
    setShowWorkshops(true); // Mostrar la lista de talleres
  };

  const handleSaveWorkshop = (newWorkshop) => {
    setWorkshops((prevWorkshops) => [...prevWorkshops, newWorkshop]);
    setShowForm(false); // Volver al menú inicial
  };

  const handleBackToMenu = () => {
    setShowForm(false);
    setShowWorkshops(false); // Volver al menú inicial
  };

  return (
    <div>
      {showForm ? (
        <WorkshopForm onSubmit={handleSaveWorkshop} />
      ) : showWorkshops ? (
        <WorkshopList workshops={workshops} onBackToMenu={handleBackToMenu} /> 
      ) : (
        <div className="flex items-start justify-center h-screen bg-white">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Gestión de Talleres
            </h2>
            <div className="flex flex-col space-y-4">
              <button
                className="bg-red-600 text-white px-32 py-4 rounded-lg font-semibold text-lg hover:bg-red-700"
                onClick={handleCreateWorkshop}
              >
                Crear Taller
              </button>
              <button
                className="bg-red-600 text-white px-32 py-4 rounded-lg font-semibold text-lg hover:bg-red-700"
                onClick={handleViewWorkshops}
              >
                Ver Talleres
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workshop;