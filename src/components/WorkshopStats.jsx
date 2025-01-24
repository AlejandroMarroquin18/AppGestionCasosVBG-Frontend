import React from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WorkshopStats = () => {
  const indicators = {
    totalWorkshops: 15,
    virtualWorkshops: 9,
    inPersonWorkshops: 6,
    averageParticipants: 5,
  };

  const indicatorNames = {
    totalWorkshops: "Talleres Realizados",
    virtualWorkshops: "Talleres Virtuales",
    inPersonWorkshops: "Talleres Presenciales",
    averageParticipants: "Participantes Promedio",
  };

  // Datos para gráficos
  const workshopsByYearData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Talleres por Año',
      data: [50, 45, 55],
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    }]
  };

  const participantsByYearData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Participantes por Año',
      data: [1200, 1300, 1250],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };

  const studentParticipantsByFacultyData = {
    labels: ["Artes", "Ciencias", "Ingeniería", "Medicina", "Derecho"],
    datasets: [{
      label: 'Estudiantes Participantes por Facultad',
      data: [200, 300, 250, 150, 100],
      backgroundColor: 'rgba(255, 206, 86, 0.5)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1,
    }]
  };

  const staffParticipantsByDepartmentData = {
    labels: ["Bienestar", "Académica", "Investigaciones"],
    datasets: [{
      label: 'Funcionarios Participantes por Departamento',
      data: [30, 45, 25],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
      },
    },
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Estadísticas de Talleres</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Object.entries(indicators).map(([key, value]) => (
          <div key={key} className={`bg-blue-100 p-4 rounded shadow text-center`}>
            <h2 className="text-xl font-semibold">{indicatorNames[key]}</h2>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <Line data={workshopsByYearData} options={options} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Line data={participantsByYearData} options={options} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Bar data={studentParticipantsByFacultyData} options={options} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Doughnut data={staffParticipantsByDepartmentData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default WorkshopStats;