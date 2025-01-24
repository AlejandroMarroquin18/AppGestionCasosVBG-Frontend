import React from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AgendaStats = () => {
  const indicators = {
    requestedAppointments: 12,
    attendedAppointments: 11,
    monthlyAppointments: 3,
    studentAppointments: 7,
    staffAppointments: 5,
  };

  const indicatorNames = {
    requestedAppointments: "Citas Pedidas",
    attendedAppointments: "Citas Atendidas",
    monthlyAppointments: "Citas por Mes",
    studentAppointments: "Citas de Estudiantes",
    staffAppointments: "Citas de Funcionarios",
  };

  const appointmentsByYearData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Citas por Año',
      data: [400, 450, 350],
      backgroundColor: 'rgba(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132)',
      borderWidth: 1,
    }]
  };

  const appointmentsByFacultyData = {
    labels: ["Artes", "Ciencias", "Ingeniería", "Medicina", "Derecho"],
    datasets: [{
      label: 'Citas por Facultad',
      data: [100, 200, 150, 250, 100],
      backgroundColor: 'rgba(248, 148, 4)',
      borderColor: 'rgba(248, 148, 4)',
      borderWidth: 1,
    }]
  };

  const appointmentsByDepartmentData = {
    labels: ["Bienestar", "Académica", "Investigaciones"],
    datasets: [{
      label: 'Citas por Departamento',
      data: [300, 400, 500],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
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
      <h1 className="text-3xl font-bold mb-6">Estadísticas de Citas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(indicators).map(([key, value]) => (
          <div key={key} className={`bg-blue-100 p-4 rounded shadow text-center`}>
            <h2 className="text-xl font-semibold">{indicatorNames[key]}</h2>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <Line data={appointmentsByYearData} options={options} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Bar data={appointmentsByFacultyData} options={options} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Doughnut data={appointmentsByDepartmentData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default AgendaStats;