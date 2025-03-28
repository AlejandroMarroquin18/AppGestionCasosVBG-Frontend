import React, { useState, useEffect } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ChartDataLabels, CategoryScale, LinearScale, BarElement, PointElement, ArcElement, LineElement, Title, Tooltip, Legend);

const baseURL = "http://127.0.0.1:8000/api";

// Función para obtener estadísticas
const getStatistics = async () => {
  const response = await fetch(`${baseURL}/talleres/statistics/`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};

const WorkshopStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStatistics()
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
      });
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  const totalWorkshops = stats.total_workshops || 0;
  const virtualWorkshops = stats.virtual_workshops || 0;
  const inPersonWorkshops = stats.in_person_workshops || 0;
  const totalParticipants = stats.total_participants || 0;
  const genderStats = stats.gender_stats || [];
  const programStats = stats.program_stats || [];

  // Calcular los porcentajes de talleres virtuales/presenciales
  const virtualPercentage = totalWorkshops > 0 ? (virtualWorkshops / totalWorkshops) * 100 : 0;
  const inPersonPercentage = totalWorkshops > 0 ? (inPersonWorkshops / totalWorkshops) * 100 : 0;

  // Gráfico de comparación de talleres
  const workshopComparisonData = {
    labels: ['2025'], // Solo mostrar el año 2025
    datasets: [
      {
        label: `Talleres virtuales`,
        data: [virtualWorkshops],
        backgroundColor: 'rgba(12, 0, 122, 0.6)',
        borderColor: 'rgba(12, 0, 122, 1)',
        borderWidth: 1,
      },
      {
        label: `Talleres presenciales`,
        data: [inPersonWorkshops],
        backgroundColor: 'rgba(221, 23, 8, 0.6)',
        borderColor: 'rgba(221, 23, 8, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico de dona
  const genderData = {
    labels: genderStats.map((stat) => stat.gender_identity),
    datasets: [
      {
        label: 'Distribución de género',
        data: genderStats.map((stat) => stat.count),
        backgroundColor: [
          'rgba(241, 29, 75, 0.6)',
          'rgba(12, 132, 212, 0.44)',
          'rgba(179, 31, 31, 0.49)',
          'rgba(93, 24, 231, 0.35)',
          'rgba(70, 233, 6, 0.56)',
        ],
      },
    ],
  };

  // Datos para el gráfico de barras (participantes por programa)
  const programData = {
    labels: programStats.map((stat) => stat.program),
    datasets: [
      {
        label: 'Participantes por departamento',
        data: programStats.map((stat) => stat.count),
        backgroundColor: 'rgba(33, 31, 199, 0.6)',
        borderColor: 'rgb(35, 25, 172)',
        borderWidth: 1,
      },
    ],
  };

  // Opciones para el gráfico de barras
  const getBarOptions = (title) => ({
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: title, // Dynamically set title based on the graph
      },
      legend: {
        position: 'top',
      },
      datalabels: {
        color: 'white',
        font: {
          weight: 'bold',
          size: 20,
        },
        // Mostrar el valor absoluto dentro de las barras
        formatter: (value) => {
          return value; // Mostrar el valor absoluto dentro de la barra
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  });

  // Opciones para el gráfico de dona (porcentajes en etiquetas)
  const doughnutOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Distribución de género',
      },
      legend: {
        position: 'top',
      },
      datalabels: {
        color: 'white',
        font: {
          weight: 'bold',
          size: 20,
        },
        // Mostrar el porcentaje en las etiquetas
        formatter: (value, ctx) => {
          const total = ctx.dataset.data.reduce((acc, val) => acc + val, 0); // Total de todos los valores en el dataset
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`; // Mostrar el porcentaje con un decimal
        },
      },
    },
  };

  return (
    <div className="w-full p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Estadísticas de talleres</h1>

      {/* Primera fila de indicadores */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="col-span-2 bg-blue-200 p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Talleres realizados en el 2025</h2>
          <p className="text-3xl font-bold">{totalWorkshops}</p>
        </div>
      </div>

      {/* Segunda fila de indicadores */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Talleres virtuales en el último año</h2>
          <p className="text-2xl font-bold">{virtualWorkshops}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Talleres presenciales en el último año</h2>
          <p className="text-2xl font-bold">{inPersonWorkshops}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Participantes totales en el último año</h2>
          <p className="text-2xl font-bold">{stats.total_participants}</p>
        </div>
      </div>

      {/* Gráficos en dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <Bar data={workshopComparisonData} options={getBarOptions('Distribución de talleres virtuales vs presenciales')} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Doughnut data={genderData} options={doughnutOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Bar data={programData} options={getBarOptions('Distribución de participantes por programa')} />
        </div>
      </div>
    </div>
  );
};

export default WorkshopStats;