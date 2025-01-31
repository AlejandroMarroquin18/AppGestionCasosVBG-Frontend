import React from "react";
import { Routes, Route } from "react-router-dom";
import ComplaintsList from "./ComplaintsList";
import ComplaintsStats from "./ComplaintsStats";
import ComplaintsDetails from "./ComplaintsDetails"; 

const Complaints = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Routes>
        <Route path="/lista" element={<ComplaintsList />} />
        <Route path="/estadisticas" element={<ComplaintsStats />} />
        <Route path="/detalles/:id" element={<ComplaintsDetails />} />
      </Routes>
    </div>
  );
};

export default Complaints;