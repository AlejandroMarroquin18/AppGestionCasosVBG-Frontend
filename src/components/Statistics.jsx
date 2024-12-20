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
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import "./styles.css";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 18, 
          },
        },
      },
      title: {
        display: true, 
        font: {
          size: 20, 
        },
      },
    },
    scales: {
      x: {
        display: false, 
      },
      y: {
        display: false,
      },
    },
  };
  
  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 18, 
          },
        },
        display: false
      },
      title: {
        display: true,
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 17,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 14, 
          },
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 18,
          },
        },
      },
      title: {
        display: true,
        font: {
          size: 20,
        },
      },
    },
  };

  const indicators = {
    visitors: 150,
    vbgCases: 45,
    psychRequests: 120,
    integralRequests: 80,
    workshops: 10,
    studentsReferrar: 25,
    officialsReferrar: 18,
  };

  // Datos para las gráficas
  const psychDataByLocation = {
    labels: ["Melendez", "San Fernando", "Buga", "Santander", "Buenaventura", "Yumbo", "Zarzal"],
    datasets: [
      {
        label: "Acompañamiento Psicológico",
        data: [30, 25, 8, 3, 6, 12, 5],
        backgroundColor: [
          "rgba(248, 148, 4)",
          "rgba(152, 196, 28)",
          "rgba(32, 156, 116)",
          "rgba(8, 172, 196)",
          "rgba(40, 92, 164)",
          "rgba(96, 52, 140)",
          "rgba(200, 4, 124)",
        ],
      },
    ],
  };

  const integralDataByLocation = {
    labels: ["Melendez", "San Fernando", "Buga", "Santander", "Buenaventura", "Yumbo", "Zarzal"],
    datasets: [
      {
        label: "Acompañamiento Integral",
        data: [10, 4, 5, 2, 1, 5, 3],
        backgroundColor: [
          "rgba(248, 148, 4)",
          "rgba(152, 196, 28)",
          "rgba(32, 156, 116)",
          "rgba(8, 172, 196)",
          "rgba(40, 92, 164)",
          "rgba(96, 52, 140)",
          "rgba(200, 4, 124)",
        ],
      },
    ],
  };

  const psychDataByFaculty = {
    labels: ["Artes Integradas", "Ciencias Naturales y Exactas", "Ciencias de la Administración", "Salud", 
      "Ciencias Sociales y Económicas", "Humanidades", "Ingeniería", "Educación y pedagogía", "Psicología", 
      "Derecho y Ciencia Política"],
    datasets: [
      {
        label: "Acompañamiento Psicológico por Facultad",
        data: [4, 3, 5, 2, 1, 6, 3, 2, 3, 4],
        backgroundColor: "rgba(248, 148, 4)",
      },
    ],
  };

  const integralDataByFaculty = {
    labels: ["Artes Integradas", "Ciencias Naturales y Exactas", "Ciencias de la Administración", "Salud", 
      "Ciencias Sociales y Económicas", "Humanidades", "Ingeniería", "Educación y pedagogía", "Psicología", 
      "Derecho y Ciencia Política"],
    datasets: [
      {
        label: "Acompañamiento Integral por Facultad",
        data: [1, 2, 3, 2, 4, 1, 2, 3, 2, 2],
        backgroundColor: "rgba(32, 156, 116)",
      },
    ],
  };

  const psychDataByCareer = {
    labels: [
      "Psicología", "Medicina", "Derecho", "Ingeniería", "Enfermería", 
      "Arquitectura", "Biología", "Filosofía", "Matemáticas", "Química"
    ],
    datasets: [
      {
        label: "Carreras con más solicitudes de asesoría psicológica",
        data: [25, 20, 15, 12, 10, 8, 7, 6, 5, 3],
        backgroundColor: [
          "rgba(8, 172, 196)",
        ],
      },
    ],
  };

  const integralDataByCareer = {
    labels: [
      "Psicología", "Medicina", "Derecho", "Ingeniería", "Enfermería", 
      "Arquitectura", "Biología", "Filosofía", "Matemáticas", "Química"
    ],
    datasets: [
      {
        label: "Carreras con más solicitudes de asesoría integral",
        data: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        backgroundColor: [
          "rgba(40, 92, 164)",
        ],
      },
    ],
  };

  const workshopData = {
    labels: ["2024-1", "2024-2", "2025-1", "2025-2"],
    datasets: [
      {
        label: "Número de Talleres",
        data: [10, 15, 9, 7], 
        borderColor: "rgba(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132)",
      },
    ],
  };

  const officialsReferralData = {
    labels: ["2021", "2022", "2023", "2024", "2025"],
    datasets: [
      {
        label: "Funcionarios remitidos por año",
        data: [12, 17, 14, 8, 0], 
        borderColor: "rgba(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235)",
      },
    ],
  };

  const studentsReferralData = {
    labels: ["2021", "2022", "2023", "2024", "2025"],
    datasets: [
      {
        label: "Estudiantes remitidos por año",
        data: [25, 30, 22, 9, 0], 
        borderColor: "rgba(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192)",
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Estadísticas</h1>

      {/* Indicadores */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-orange-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Visitantes</h2>
          <p className="text-3xl font-bold">{indicators.visitors}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Solicitudes de asesoría psicológica</h2>
          <p className="text-3xl font-bold">{indicators.psychRequests}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Solicitudes de asesoría integral</h2>
          <p className="text-3xl font-bold">{indicators.integralRequests}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Talleres realizados</h2>
          <p className="text-3xl font-bold">{indicators.workshops}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Remisiones de estudiantes</h2>
          <p className="text-3xl font-bold">{indicators.studentsReferrar}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Resimisiones de funcionarios</h2>
          <p className="text-3xl font-bold">{indicators.officialsReferrar}</p>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Acompañamiento psicológico por sede</h3>
          <Doughnut data={psychDataByLocation} options={doughnutOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Acompañamiento integral por sede</h3>
          <Doughnut data={integralDataByLocation} options={doughnutOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Acompañamiento psicológico por facultad</h3>
          <Bar data={psychDataByFaculty} options={commonOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Acompañamiento integral por facultad</h3>
          <Bar data={integralDataByFaculty} options={commonOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Acompañamiento psicológico (Carreras con más solicitudes)</h3>
          <Bar data={psychDataByCareer} options={commonOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Acompañamiento integral (carreras con más solicitudes)</h3>
          <Bar data={integralDataByCareer} options={commonOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Talleres por Semestre</h3>
          <Line data={workshopData} options={lineOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Funcionarios remitidos por año</h3>
          <Line data={officialsReferralData} options={lineOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Estudiantes remitidos por año</h3>
          <Line data={studentsReferralData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
