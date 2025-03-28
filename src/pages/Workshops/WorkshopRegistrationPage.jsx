// Usando export default
import React from "react";
import WorkshopRegistrationForm from "./WorkshopRegistrationForm"; // Asegúrate de que esto sea un import correcto

const WorkshopRegistrationPage = () => {
  return (
    <div className="w-full h-screen bg-white">
      <WorkshopRegistrationForm />
    </div>
  );
};

export default WorkshopRegistrationPage; // Esto debe ser un export default
