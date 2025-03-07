import React from "react";
import WorkshopForm from "../pages/Workshops/WorkshopForm";
import WorkshopList from "../pages/Workshops/WorkshopList";
import WorkshopDetails from "../pages/Workshops/WorkshopDetails";
import WorkshopStats from "../pages/Workshops/WorkshopStats";
import { Routes, Route, useNavigate } from "react-router-dom";

const Workshop = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-start justify-center h-screen bg-white">
      <Routes>
        <Route
          path="/crear"
          element={
            <WorkshopForm onSave={(workshop) => navigate("/talleres/ver")} />
          }
        />
        <Route path="/ver" element={<WorkshopList />} />
        <Route path="/detalles/:workshopId" element={<WorkshopDetails />} />
        <Route path="/estadisticas" element={<WorkshopStats />} />
      </Routes>
    </div>
  );
};

export default Workshop;
