import React from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ComplaintsStats = () => {
  // Datos simulados para los indicadores
  const indicators = {
    receivedComplaints: 32,
    processedComplaints: 28,
    referredComplaints: 12,
    studentComplaints: 18,
    staffComplaints: 14,
  };

  const indicatorNames = {
    receivedComplaints: "Quejas Recibidas",
    processedComplaints: "Quejas Procesadas",
    referredComplaints: "Quejas Remitidas",
    studentComplaints: "Quejas de Estudiantes",
    staffComplaints: "Quejas de Funcionarios",
  };  

  // Datos para gráficos
  const complaintsByFacultyData = {
    labels: ["Artes", "Ciencias", "Ingeniería", "Medicina", "Derecho"],
    datasets: [{
      label: 'Quejas por Facultad',
      data: [50, 70, 40, 80, 80],
      backgroundColor: 'rgba(40, 92, 164)',
      borderColor: 'rgba(40, 92, 164)',
      borderWidth: 1,
    }]
  };

  const complaintsByLocationData = {
    labels: ["Melendez", "San Fernando", "Buga"],
    datasets: [{
      label: 'Quejas por Sede',
      data: [120, 100, 100],
      backgroundColor: ['rgba(255, 99, 132)', 'rgba(255, 99, 132)', 'rgba(255, 99, 132)'],
      borderColor: ['rgba(255, 99, 132)', 'rgba(255, 99, 132)', 'rgba(255, 99, 132)'],
      borderWidth: 1,
    }]
  };

  const complaintsByYearData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Quejas por Año',
      data: [100, 110, 110],
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    }]
  };

  const complaintsByDepartmentData = {
    labels: ["Bienestar", "Académica", "Investigaciones"],
    datasets: [{
      label: 'Quejas por Departamento',
      data: [90, 130, 100],
      backgroundColor: 'rgba(255, 159, 64, 0.5)',
      borderColor: 'rgba(255, 159, 64, 1)',
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
      <h1 className="text-3xl font-bold mb-6">Estadísticas de Quejas</h1>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Indicadores como tarjetas */}
        {Object.entries(indicators).map(([key, value]) => (
          <div key={key} className={`bg-blue-100 p-4 rounded shadow text-center`}>
            <h2 className="text-xl font-semibold">{indicatorNames[key]}</h2>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráficos */}
        <div className="bg-white p-4 rounded shadow">
          <Bar data={complaintsByFacultyData} options={options} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Bar data={complaintsByLocationData} options={options} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Line data={complaintsByYearData} options={options} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Doughnut data={complaintsByDepartmentData} options={options} />
        </div>
      </div>
    </div>
  );  
};

export default ComplaintsStats;