import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AgendaList from "./AgendaList";
import AgendaStats from "./AgendaStats";


const Agenda = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Routes>
        <Route path="/list" element={<AgendaList />} />
        <Route path="/estadisticas" element={<AgendaStats />} />
      </Routes>
    </div>
  );
};

export default Agenda;