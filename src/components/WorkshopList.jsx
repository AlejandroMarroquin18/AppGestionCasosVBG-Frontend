import React from "react";

const WorkshopList = ({ workshops, onBackToMenu }) => {
  return (
    <div className="flex items-start justify-center h-screen bg-white">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Lista de Talleres
        </h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border text-left">Nombre del Taller</th>
              <th className="px-4 py-2 border text-left">Hora de Inicio</th>
              <th className="px-4 py-2 border text-left">Hora de Finalización</th>
              <th className="px-4 py-2 border text-left">Ubicación</th>
              <th className="px-4 py-2 border text-left">Modalidad</th>
              <th className="px-4 py-2 border text-left">Cupos</th>
              <th className="px-4 py-2 border text-left">Correo</th>
              <th className="px-4 py-2 border text-left">Código</th>
              <th className="px-4 py-2 border text-left">Detalles</th>
              <th className="px-4 py-2 border text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {workshops.length > 0 ? (
              workshops.map((workshop, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{workshop.name}</td>
                  <td className="px-4 py-2">{workshop.startTime}</td>
                  <td className="px-4 py-2">{workshop.endTime}</td>
                  <td className="px-4 py-2">{workshop.location}</td>
                  <td className="px-4 py-2">{workshop.mode}</td>
                  <td className="px-4 py-2">{workshop.quota}</td>
                  <td className="px-4 py-2">{workshop.email}</td>
                  <td className="px-4 py-2">{workshop.code}</td>
                  <td className="px-4 py-2">{workshop.details}</td>
                  <td className="px-4 py-2">{workshop.status}</td>
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
        <div className="mt-4 flex justify-center">
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
          onClick={onBackToMenu}
        >
          Volver al Menú Inicial
        </button>
      </div>
      </div>
    </div>
  );
};

export default WorkshopList;