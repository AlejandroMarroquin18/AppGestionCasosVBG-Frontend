import React, { useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./styles.css";

const ComplaintsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplaints, setSelectedComplaints] = useState({});
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [complaints, setComplaints] = useState([]);  // Estado para almacenar las quejas

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/quejas/')
      .then(response => response.json())
      .then(data => setComplaints(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const toggleComplaintSelection = (id) => {
    const newSelections = {
      ...selectedComplaints,
      [id]: !selectedComplaints[id],
    };
    setSelectedComplaints(newSelections);
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesLocation = locationFilter === "" || (complaint.sede && complaint.sede.includes(locationFilter));
    const matchesType = typeFilter === "" || (complaint.tipo_de_acompanamiento && complaint.tipo_de_acompanamiento.includes(typeFilter));
    const matchesCode = searchTerm === "" || (complaint.codigo && complaint.codigo.includes(searchTerm));
  
    return matchesLocation && matchesType && matchesCode;
  });
   

  return (
    <div className="lista-content p-6 text-base relative bg-white">
      <h1 className="text-3xl font-bold mb-6">Lista de quejas</h1>

      <div className="flex justify-between mb-4 items-center">
        <div
          style={{ maxWidth: "500px" }}
          className="flex w-full overflow-hidden rounded-xl border border-gray-300"
        >
          <input
            type="text"
            placeholder="Buscar por código"
            className="px-4 py-2 w-full border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-gray-200 px-4 py-2">
            <FiSearch />
          </button>
        </div>
        <div className="flex space-x-2 ml-4">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border p-2"
          >
            <option value="">Filtrar por Sede</option>
            <option value="Zarzal">Zarzal</option>
            <option value="Melendez">Melendez</option>
            <option value="Buga">Buga</option>
            <option value="Santander">Santander</option>
            <option value="B/ventura">B/ventura</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border p-2"
          >
            <option value="">Filtrar por Tipo</option>
            <option value="Psicológico">
              Acompañamiento psicológico
            </option>
            <option value="Integral">
              Acompañamiento integral
            </option>
          </select>
        </div>
      </div>

      <table className="w-full border-collapse text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Sede</th>
            <th className="border p-2">Código</th>
            <th className="border p-2">Tipo de acompañamiento</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Detalles</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.map((complaint) => (
            <tr
              key={complaint.id}
              className={`${selectedComplaints[complaint.id] ? "bg-gray-200" : ""}`}
              onClick={() => toggleComplaintSelection(complaint.id)}
            >
              <td className="border p-2">{complaint.id}</td>
              <td className="border p-2">{complaint.nombre}</td>
              <td className="border p-2">{complaint.sede}</td>
              <td className="border p-2">{complaint.codigo}</td>
              <td className="border p-2">{complaint.tipo_de_acompanamiento}</td>
              <td className="border p-2">{complaint.fecha}</td>
              <td className="border p-2">{complaint.estado}</td>
              <td className="border p-2">
                <button className="text-red-600 bg-white hover:underline">
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className="fixed bottom-0 left-auto right-0 w-[calc(100%-250px)] bg-white p-4 flex justify-between items-center border-t shadow"
        style={{ zIndex: 50 }}
      >
        <button className="text-red-600 bg-white hover:underline">
          Descargar como CSV
        </button>
        <div className="flex items-center space-x-2">
          <span>1 de 5</span>
          <button
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-lg shadow hover:shadow-lg transition duration-300 flex justify-center items-center"
            style={{ width: "40px", height: "40px" }}
          >
            <FiChevronLeft />
          </button>
          <button
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-lg shadow hover:shadow-lg transition duration-300 flex justify-center items-center"
            style={{ width: "40px", height: "40px" }}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsList;