import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
} from "react-icons/fi";

const ComplaintsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplaints, setSelectedComplaints] = useState({});
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [complaintsPerPage] = useState(7);
  const [facultyFilter, setFacultyFilter] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/quejas/")
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => a.id - b.id);
        setComplaints(sortedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [locationFilter, typeFilter, searchTerm]);

  const filteredComplaints = complaints.filter((complaint) => {
    return (
      (locationFilter === "" ||
        (complaint.sede && complaint.sede.includes(locationFilter))) &&
      (typeFilter === "" ||
        (complaint.tipo_de_acompanamiento &&
          complaint.tipo_de_acompanamiento.includes(typeFilter))) &&
      (facultyFilter === "" ||
        (complaint.facultad && complaint.facultad.includes(facultyFilter))) &&
      (searchTerm === "" ||
        (complaint.codigo && complaint.codigo.includes(searchTerm)))
    );
  });

  const lastPageIndex = currentPage * complaintsPerPage;
  const firstPageIndex = lastPageIndex - complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(
    firstPageIndex,
    lastPageIndex
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    if (
      currentPage < Math.ceil(filteredComplaints.length / complaintsPerPage)
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const toggleComplaintSelection = (id) => {
    setSelectedComplaints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="lista-content p-6 text-base relative bg-white">
      <h1 className="text-3xl font-bold mb-6">Lista de quejas</h1>

      <div className="search-and-filters flex justify-between w-full mb-4">
        <div
          style={{ maxWidth: "500px" }}
          className="flex w-full overflow-hidden rounded-xl border border-gray-300 items-center"
        >
          <input
            type="text"
            placeholder="Buscar por código"
            className="px-4 py-2 w-full border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ height: "100%" }}
          />
          <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2">
            <FiSearch size={24} />
          </button>
        </div>

        <div className="filters-button relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2"
          >
            <FiFilter /> Filtros
          </button>

          {showFilters && (
            <div
              className="filter-panel"
              style={{
                position: "absolute",
                top: "100%",
                right: "0",
                backgroundColor: "white",
                border: "1px solid #ccc",
                zIndex: 100,
                boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                width: "350px",
                overflow: "hidden",
              }}
            >
              <div className="filter-group mb-4">
                <h4 className="mb-1 text-xl font-semibold">Sede</h4>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="border w-full text-sm h-10" 
                >
                  <option value="">Todos</option>
                  <option value="Zarzal">Zarzal</option>
                  <option value="Melendez">Melendez</option>
                  <option value="Buga">Buga</option>
                  <option value="Santander">Santander</option>
                  <option value="Buenaventura">B/ventura</option>
                </select>
              </div>
              <div className="filter-group mb-4">
                <h4 className="mb-1 text-xl font-semibold">Tipo</h4>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border w-full text-sm h-10" 
                >
                  <option value="">Todos</option>
                  <option value="Psicológico">
                    Acompañamiento psicológico
                  </option>
                  <option value="Integral">Acompañamiento integral</option>
                </select>
              </div>
              <div className="filter-group">
                <h4 className="mb-1 text-xl font-semibold">Facultad</h4>
                <select
                  value={facultyFilter}
                  onChange={(e) => setFacultyFilter(e.target.value)}
                  className="border w-full text-sm h-10" 
                >
                  <option value="">Todos</option>
                  <option value="Artes">Artes Integradas</option>
                  <option value="Ciencias Naturales">
                    Ciencias Naturales y Exactas
                  </option>
                  <option value="Ciencias de la Administración">
                    Ciencias de la Administración
                  </option>
                  <option value="Salud">Salud</option>
                  <option value="Ciencias Sociales">
                    Ciencias Sociales y Económicas
                  </option>
                  <option value="Humanidades">Humanidades</option>
                  <option value="Ingeniería">Ingeniería</option>
                  <option value="Educación">Educación y pedagogía</option>
                  <option value="Psicología">Psicología</option>
                  <option value="Derecho">Derecho y Ciencia Política</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table layout */}
      <table className="w-full border-collapse text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Sede</th>
            <th className="border p-2">Código</th>
            <th className="border p-2">Facultad</th>
            <th className="border p-2">Unidad Académica</th>
            <th className="border p-2">Acompañamiento</th>
            <th className="border p-2">Fecha de solicitud</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Detalles</th>
          </tr>
        </thead>
        <tbody>
          {currentComplaints.map((complaint) => (
            <tr
              key={complaint.id}
              className={`${
                selectedComplaints[complaint.id] ? "bg-gray-200" : ""
              }`}
              onClick={() => toggleComplaintSelection(complaint.id)}
            >
              <td className="border p-2">{complaint.id}</td>
              <td className="border p-2">{complaint.nombre}</td>
              <td className="border p-2">{complaint.sede}</td>
              <td className="border p-2">{complaint.codigo}</td>
              <td className="border p-2">{complaint.facultad}</td>
              <td className="border p-2">{complaint.unidad}</td>
              <td className="border p-2">{complaint.tipo_de_acompanamiento}</td>
              <td className="border p-2">{complaint.fecha}</td>
              <td className="border p-2">{complaint.estado}</td>
              <td className="border p-2">
                <button
                  onClick={() =>
                    (window.location.href = `/quejas/detalles/${complaint.id}/`)
                  }
                  className="text-red-600 bg-white hover:underline"
                >
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
          <button
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-lg shadow hover:shadow-lg transition duration-300 flex justify-center items-center"
            style={{ width: "40px", height: "40px" }}
            onClick={handlePreviousPage}
          >
            <FiChevronLeft />
          </button>
          <span>
            {currentPage} de{" "}
            {Math.ceil(filteredComplaints.length / complaintsPerPage)}
          </span>
          <button
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-lg shadow hover:shadow-lg transition duration-300 flex justify-center items-center"
            style={{ width: "40px", height: "40px" }}
            onClick={handleNextPage}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsList;
