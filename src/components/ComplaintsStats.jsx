import React from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ComplaintsStats = () => {
  const indicators = {
    receivedComplaints: 32,
    referredComplaints: 12,
    studentComplaints: 18,
    staffComplaints: 4,
    professorComplaints: 10,
    studentReferrals: 7,
    staffReferrals: 3,
    professorReferrals: 2,
  };

  const indicatorNames = {
    receivedComplaints: "Quejas recibidas en el último año",
    referredComplaints: "Quejas remitidas en el último año",
    studentComplaints: "Quejas de estudiantes",
    staffComplaints: "Quejas de funcionarios",
    professorComplaints: "Quejas de profesores",
    studentReferrals: "Remisiones de estudiantes",
    staffReferrals: "Remisiones de funcionarios",
    professorReferrals: "Remisiones de profesores",
  };

  const complaintsByFacultyData = {
    labels: ["Artes", "Ciencias", "Ingeniería", "Medicina", "Derecho"],
    datasets: [
      {
        label: "Quejas por facultad",
        data: [50, 70, 40, 80, 80],
        backgroundColor: "rgba(40, 92, 164)",
        borderColor: "rgba(40, 92, 164)",
        borderWidth: 1,
      },
    ],
  };

  const complaintsByLocationData = {
    labels: ["Melendez", "San Fernando", "Buga"],
    datasets: [
      {
        label: "Quejas por sede",
        data: [120, 100, 100],
        backgroundColor: [
          "rgba(255, 99, 132)",
          "rgba(255, 99, 132)",
          "rgba(255, 99, 132)",
        ],
        borderColor: [
          "rgba(255, 99, 132)",
          "rgba(255, 99, 132)",
          "rgba(255, 99, 132)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const complaintsByYearData = {
    labels: ["2022", "2023", "2024"],
    datasets: [
      {
        label: "Quejas por año",
        data: [30, 38, 32],
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const complaintsByDepartmentData = {
    labels: ["Bienestar", "Académica", "Investigaciones"],
    datasets: [
      {
        label: "Quejas por departamento",
        data: [20, 13, 10],
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        font: {
          size: 20, 
          style: 'bold', 
          family: 'Arial'
        }
      },
    },
  }

  return (
    <div className="p-6 bg-white min-h-screen">
  <h1 className="text-3xl font-bold mb-6">Estadísticas de quejas</h1>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
    {/* Quejas Recibidas */}
    <div>
      <div className="bg-blue-200 p-4 rounded shadow text-center">
        <h2 className="text-xl font-semibold">{indicatorNames.receivedComplaints}</h2>
        <p className="text-3xl font-bold">{indicators.receivedComplaints}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {["studentComplaints", "professorComplaints", "staffComplaints"].map((key) => (
          <div key={key} className="bg-blue-100 p-4 rounded shadow text-center">
            <h2 className="text-lg font-semibold">{indicatorNames[key]}</h2>
            <p className="text-2xl font-bold">{indicators[key]}</p>
          </div>
        ))}
      </div>
    </div>
    {/* Quejas Remitidas */}
    <div>
      <div className="bg-green-200 p-4 rounded shadow text-center">
        <h2 className="text-xl font-semibold">{indicatorNames.referredComplaints}</h2>
        <p className="text-3xl font-bold">{indicators.referredComplaints}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {["studentReferrals", "professorReferrals", "staffReferrals"].map((key) => (
          <div key={key} className="bg-green-100 p-4 rounded shadow text-center" style={{ minWidth: '180px' }}>
            <h2 className="text-lg font-semibold">{indicatorNames[key]}</h2>
            <p className="text-2xl font-bold">{indicators[key]}</p>
          </div>
        ))}
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráficos */}
        <div className="bg-white p-4 rounded shadow">
          <Bar data={complaintsByFacultyData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Quejas por facultad' } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Bar data={complaintsByLocationData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Quejas por sede' } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Line data={complaintsByYearData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Quejas por año' } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Doughnut data={complaintsByDepartmentData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Quejas por departamento' } } }} />
        </div>
      </div>
      </div>
  );
};

export default ComplaintsStats;
