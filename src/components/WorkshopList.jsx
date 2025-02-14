import React, { useState, useEffect } from "react";

const WorkshopList = ({ onBackToMenu }) => {
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/talleres/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setWorkshops(data);
      } catch (error) {
        console.error("Error fetching workshops:", error);
        alert("Failed to fetch workshops");
      }
    };

    fetchWorkshops();
  }, []);

  return (
    <div className="lista-content p-6 text-base relative bg-white">
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Lista de talleres</h1>
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-gray-100 text-xl">
              <th className="border p-2">Nombre del Taller</th>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Hora de Inicio</th>
              <th className="border p-2">Hora de Finalización</th>
              <th className="border p-2">Ubicación</th>
              <th className="border p-2">Modalidad</th>
              <th className="border p-2">Beneficiarios</th>
              <th className="border p-2">Tallerista</th>
              <th className="border p-2">Detalles</th>
              <th className="border p-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {workshops.length > 0 ? (
              workshops.map((workshop, index) => (
                <tr key={index} className="hover:bg-gray-200">
                  <td className="border p-2">{workshop.name}</td>
                  <td className="border p-2">{workshop.date}</td>
                  <td className="border p-2">{workshop.start_time}</td>
                  <td className="border p-2">{workshop.end_time}</td>
                  <td className="border p-2">{workshop.location}</td>
                  <td className="border p-2">{workshop.modality}</td>
                  <td className="border p-2">{workshop.slots}</td>
                  <td className="border p-2">{workshop.facilitator}</td>
                  <td className="border p-2">{workshop.details}</td>
                  <td className="border p-2">
                    {new Date(workshop.date) > new Date()
                      ? "Pendiente"
                      : "Realizado"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-2 text-center text-gray-500">
                  No hay talleres creados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkshopList;