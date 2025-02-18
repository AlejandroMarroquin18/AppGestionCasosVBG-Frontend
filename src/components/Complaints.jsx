import React from "react";
import { Routes, Route } from "react-router-dom";
import ComplaintsList from "./complaintsList";
import ComplaintStats from "../pages/estadisticas/ComplaintStats";
import ComplaintsDetails from "./ComplaintsDetails";

const Complaints = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Routes>
        <Route path="/lista" element={<ComplaintsList />} />
        <Route path="/estadisticas" element={<ComplaintStats />} /> 
        <Route path="/detalles/:id" element={<ComplaintsDetails />} />
      </Routes>
    </div>
  );
};

export default Complaints;
