import React, { useState } from "react";
import WorkshopForm from "./WorkshopForm"; 
import WorkshopList from "./WorkshopList";
import WorkshopStats from "./WorkshopStats";
import { Routes, Route, useNavigate, Link } from 'react-router-dom';

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
  const navigate = useNavigate();

  return (
    <div className="flex items-start justify-center h-screen bg-white">
      <Routes>
        <Route path="/crear" element={<WorkshopForm onSave={workshop => {
          navigate('/talleres/ver');
        }} />} />
        <Route path="/ver" element={<WorkshopList workshops={workshopsData} onBackToMenu={() => navigate('/talleres')} />} />
        <Route path="/estadisticas" element={<WorkshopStats />} />
      </Routes>
    </div>
  );
};

export default Workshop;