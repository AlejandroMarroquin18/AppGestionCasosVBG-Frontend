import React from "react";
import WorkshopForm from "./WorkshopForm";
import WorkshopList from "./WorkshopList";
import WorkshopDetails from "./WorkshopDetails";
import WorkshopStats from "../pages/estadisticas/WorkshopStats";
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
        <Route
          path="/talleres/detalles/:workshopId"
          element={<WorkshopDetails />}
        />
        <Route path="/estadisticas" element={<WorkshopStats />} />
      </Routes>
    </div>
  );
};

export default Workshop;
