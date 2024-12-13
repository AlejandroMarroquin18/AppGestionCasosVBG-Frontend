import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./styles.css";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
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
            size: 18, // Tamaño de letra de la leyenda
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

  const indicators = {
    visitors: 150,
    vbgCases: 45,
    psychRequests: 120,
    integralRequests: 80,
  };

  // Datos para las gráficas
  const psychDataByLocation = {
    labels: ["Melendez", "San Fernando", "Buga", "Santander", "Buenaventura", "Yumbo", "Zarzal"],
    datasets: [
      {
        label: "Acompañamiento Psicológico",
        data: [30, 25, 8, 3, 6, 12, 5],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(201, 203, 207, 0.6)",
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
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(201, 203, 207, 0.6)",
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
        backgroundColor: "rgba(60, 235, 54, 0.6)",
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
        backgroundColor: "rgba(255, 206, 86, 0.6)",
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
          "rgba(126, 87, 194, 0.6)",
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
          "rgba(54, 162, 235, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Estadísticas</h1>

      {/* Indicadores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow">
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
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Acompañamiento psicológico por Sede</h3>
          <Doughnut data={psychDataByLocation} options={doughnutOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Acompañamiento integral por Sede</h3>
          <Doughnut data={integralDataByLocation} options={doughnutOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Solicitudes de acompañamiento psicológico por Facultad</h3>
          <Bar data={psychDataByFaculty} options={commonOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Solicitudes de acompañamiento integral por Facultad</h3>
          <Bar data={integralDataByFaculty} options={commonOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Carreras con más solicitudes psicológicas</h3>
          <Bar data={psychDataByCareer} options={commonOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Carreras con más solicitudes integrales</h3>
          <Bar data={integralDataByCareer} options={commonOptions} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
