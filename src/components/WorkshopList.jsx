import React, { useState, useEffect } from "react";
import { FiSearch, FiTrash2, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <FiTrash2 className="mr-2" size={24} />
          Confirmación
        </h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-center space-x-4">
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Confirmar
          </button>
          <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const WorkshopList = ({ onBackToMenu }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [workshops, setWorkshops] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [modalityFilter, setModalityFilter] = useState("");
  const [locationFilter] = useState(""); // Make sure you want this to be a non-updatable constant
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/talleres/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setWorkshops(
          data.map((workshop) => ({
            ...workshop,
            date: new Date(workshop.date),
          }))
        );
      } catch (error) {
        console.error("Error fetching workshops:", error);
        alert("Failed to fetch workshops");
      }
    };

    fetchWorkshops();
  }, []);

  const openModal = (workshop) => {
    setSelectedWorkshopId(workshop.id);
    setModalMessage(`¿Desea eliminar el taller "${workshop.name}"?`);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/talleres/${selectedWorkshopId}/`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the workshop");
      }
      setWorkshops(
        workshops.filter((workshop) => workshop.id !== selectedWorkshopId)
      );
      closeModal();
    } catch (error) {
      console.error("Error deleting workshop:", error);
    }
  };

  const filteredWorkshops = workshops.filter((workshop) => {
    return (
      (!dateFilter ||
        workshop.date.toISOString().slice(0, 10) === dateFilter) &&
      (!modalityFilter || workshop.modality.includes(modalityFilter)) &&
      (!locationFilter || workshop.location.includes(locationFilter)) &&
      (!statusFilter ||
        (new Date() < workshop.date ? "Pendiente" : "Realizado") ===
          statusFilter) &&
      (!searchTerm ||
        workshop.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="lista-content p-6 text-base relative bg-white">
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Lista de talleres</h1>
        <div className="search-and-filters flex flex-col w-full mb-4">
          <div
            style={{ maxWidth: "500px" }}
            className="flex w-full overflow-hidden rounded-xl border border-gray-300 items-center"
          >
            <input
              type="text"
              placeholder="Buscar por nombre"
              className="px-4 py-2 w-full border-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2">
              <FiSearch size={24} />
            </button>
          </div>
          <div className="flex justify-between">
            <div className="filter-group mb-4">
              <h4 className="mb-1 text-xl font-semibold">Fecha de inicio</h4>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border w-full text-sm h-10"
              />
            </div>
            <div className="filter-group mb-4">
              <h4 className="mb-1 text-xl font-semibold">Modalidad</h4>
              <select
                value={modalityFilter}
                onChange={(e) => setModalityFilter(e.target.value)}
                className="border w-full text-sm h-10"
              >
                <option value="">Todos</option>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
            <div className="filter-group mb-4">
              <h4 className="mb-1 text-xl font-semibold">Estado</h4>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border w-full text-sm h-10"
              >
                <option value="">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Realizado">Realizado</option>
              </select>
            </div>
          </div>
        </div>
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-gray-100 text-xl">
              <th className="border p-2">Nombre del taller</th>
              <th className="border p-2">Fecha de inicio</th>
              <th className="border p-2">Hora de inicio</th>
              <th className="border p-2">Hora de finalización</th>
              <th className="border p-2">Ubicación</th>
              <th className="border p-2">Modalidad</th>
              <th className="border p-2">Beneficiarios</th>
              <th className="border p-2">Tallerista</th>
              <th className="border p-2">Detalles</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Acciones</th>
              <th className="border p-2">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkshops.length > 0 ? (
              filteredWorkshops.map((workshop, index) => (
                <tr key={index} className="hover:bg-gray-200">
                  <td className="border p-2">{workshop.name}</td>
                  <td className="border p-2">
                    {workshop.date.toISOString().slice(0, 10)}
                  </td>
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
                  <td className="border p-2">
                    <button
                      onClick={() => openModal(workshop)}
                      className="text-white-500 hover:text-red-700"
                    >
                      <FiTrash2 size={24} />
                    </button>
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() =>
                        (window.location.href = `/talleres/detalles/${workshop.id}/`)
                      }
                      className="text-white-500 hover:text-red-700"
                    >
                      <FiEye size={24} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="w-full px-4 py-2 text-center text-gray-500"
                >
                  No hay talleres creados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <ConfirmationModal
          isOpen={modalOpen}
          onClose={closeModal}
          onConfirm={handleDelete}
          message={modalMessage}
        />
      </div>
    </div>
  );
};

export default WorkshopList;
