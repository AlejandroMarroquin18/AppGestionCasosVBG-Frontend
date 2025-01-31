import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ComplaintsList from "./complaintsList";
import ComplaintsStats from "./ComplaintsStats";

const Complaints = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Routes>
        <Route path="/lista" element={<ComplaintsList />} />
        <Route path="/estadisticas" element={<ComplaintsStats />} />
      </Routes>
    </div>
  );
};

export default Complaints;