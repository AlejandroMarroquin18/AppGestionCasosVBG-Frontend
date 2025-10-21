import React, { useState, useEffect } from "react";
import { Doughnut, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { baseURL } from "../../api";
import getCSRFToken from "../../helpers/getCSRF";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);



const WorkshopStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  /*
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${baseURL}/talleres/statistics/`);
        if (!response.ok) throw new Error("Error al cargar estadísticas");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  */
 useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await fetch(`${baseURL}/talleres/statistics/`,{
  method: "GET",
  headers: {
    "Authorization": `Token ${localStorage.getItem("userToken")}`, 
    "X-CSRFToken": getCSRFToken(),
  },
  credentials: "include",
  });
      
      if (!response.ok) throw new Error("Error al cargar estadísticas");
      const data = await response.json();
      console.log("Workshop Statistics:", data);

      // Asegura que todos los campos sean arrays, incluso vacíos
      setStats({
        ...data,
        gender_stats: data.gender_stats || [],
        program_stats: data.program_stats || [],
        age_stats: data.age_stats || [],
        ethnicity_stats: data.ethnicity_stats || [],
        disability_stats: data.disability_stats || [],
      });
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);

  if (loading)
    return <div className="text-center py-8">Cargando estadísticas...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!stats)
    return <div className="text-center py-8">No hay datos disponibles</div>;

  // Configuración común para gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: "#fff",
        font: { weight: "bold", size: 14 },
        formatter: (value, ctx) => {
          if (ctx.chart.data.datasets[0].data.length > 5) {
            return value > 0 ? value : "";
          }
          const total = ctx.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0
          );
          const percentage = Math.round((value / total) * 100);
          return `${percentage}%`;
        },
      },
      legend: {
        position: "right",
        labels: {
          boxWidth: 12,
          padding: 20,
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        font: { size: 16 },
      },
    },
  };

  // Gráfico de modalidad de talleres
  const modalityData = {
    labels: ["Virtuales", "Presenciales"],
    datasets: [
      {
        data: [stats.virtual_workshops, stats.in_person_workshops],
        backgroundColor: ["#3b82f6", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  // Gráfico de distribución por género
  const genderData = {
  labels: stats.gender_stats?.map(
    (item) => item.gender_identity || "No especificado"
  ) || [],
  datasets: [
    {
      data: stats.gender_stats?.map((item) => item.count) || [],
      backgroundColor: [
        "#3b82f6",
        "#ef4444",
        "#10b981",
        "#f59e0b",
        "#8b5cf6",
      ],
    },
  ],
};

  // Gráfico de programas académicos
  const programData = {
  labels: stats.program_stats?.map((item) => item.program || "No especificado") || [],
  datasets: [
    {
      label: "Participantes",
      data: stats.program_stats?.map((item) => item.count) || [],
      backgroundColor: "#3b82f6",
    },
  ],
};

  // Gráfico de grupos de edad
  const ageData = {
    labels: stats.age_stats.map((item) => item.age_group),
    datasets: [
      {
        label: "Participantes",
        data: stats.age_stats.map((item) => item.count),
        backgroundColor: "#10b981",
      },
    ],
  };

  // Gráfico de autoreconocimiento étnico
  const ethnicityData = {
    labels: stats.ethnicity_stats.map(
      (item) => item.self_recognition || "No especificado"
    ),
    datasets: [
      {
        data: stats.ethnicity_stats.map((item) => item.count),
        backgroundColor: [
          "#f59e0b",
          "#3b82f6",
          "#ef4444",
          "#10b981",
          "#8b5cf6",
        ],
      },
    ],
  };

  // Gráfico de discapacidades
  const disabilityData = {
    labels: stats.disability_stats.map((item) => item.disability),
    datasets: [
      {
        label: "Participantes",
        data: stats.disability_stats.map((item) => item.count),
        backgroundColor: "#8b5cf6",
      },
    ],
  };

  return (
    <div className="mx-auto px-4 py-8 w-full max-w-7xl">
      {" "}
      {/* Añadido max-w-7xl para limitar el ancho máximo */}
      <h1 className="text-3xl font-bold mb-8 text-center">
        Estadísticas de Talleres
      </h1>
      {/* Tarjetas resumen - Total Talleres arriba, las demás abajo en 2 columnas en pantallas grandes */}
      <div className="grid grid-cols-1 gap-6 mb-10">
        {/* Card superior */}
        <StatCard
          title="Total talleres en el último año"
          value={stats.total_workshops}
          icon="📊"
          color="bg-blue-100"
        />

        {/* Cards inferiores en 2 columnas en md y 3 columnas en lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Virtuales"
            value={stats.virtual_workshops}
            icon="💻"
            color="bg-green-100"
          />
          <StatCard
            title="Presenciales"
            value={stats.in_person_workshops}
            icon="🏢"
            color="bg-red-100"
          />
          <StatCard
            title="Participantes"
            value={stats.total_participants}
            icon="👥"
            color="bg-purple-100"
          />
        </div>
      </div>
      {/* Sección de gráficos - ahora con más espacio */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
        {/* Fila 1 - Gráficos circulares */}
        <div className="space-y-8">
          <ChartCard title="Modalidad de talleres" height="h-96">
            <Doughnut
              data={modalityData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: "Distribución por modalidad",
                    display: true,
                  },
                },
              }}
            />
          </ChartCard>

          <ChartCard title="Distribución de participantes por género" height="h-96">
            <Pie
              data={genderData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: "Distribución por género",
                    display: true,
                  },
                },
              }}
            />
          </ChartCard>
        </div>

        {/* Fila 2 - Gráficos de barras */}
        <div className="space-y-8">
          <ChartCard title="Participantes por programa académico" height="h-96">
            <Bar
              data={programData}
              options={{
                ...chartOptions,
                indexAxis: "y",
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: "Top Programas",
                    display: true,
                  },
                },
              }}
            />
          </ChartCard>

          <ChartCard title="Participantes de talleres por edad" height="h-96">
            <Bar
              data={ageData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: "Grupos de edad",
                    display: true,
                  },
                },
              }}
            />
          </ChartCard>
        </div>

        {/* Fila 3 - Gráficos adicionales */}
        <div className="space-y-8">
          <ChartCard title="Autoreconocimiento étnico de participantes" height="h-96">
            <Doughnut
              data={ethnicityData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: "Autoreconocimiento étnico",
                    display: true,
                  },
                },
              }}
            />
          </ChartCard>
        </div>

        <div className="space-y-8">
          <ChartCard title="Tipos de discapacidad de los participantes" height="h-96">
            <Bar
              data={disabilityData}
              options={{
                ...chartOptions,
                indexAxis: "y",
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: "Discapacidades registradas",
                    display: true,
                  },
                },
              }}
            />
          </ChartCard>
        </div>
      </div>
      <div className="mt-8 text-sm text-gray-500 text-center">
        Última actualización: {new Date(stats.last_update).toLocaleString()}
      </div>
    </div>
  );
};

// Componente auxiliar para tarjetas de estadísticas mejorado
const StatCard = ({ title, value, icon, color }) => (
  <div className={`${color} p-6 rounded-lg shadow-lg h-full flex items-center`}>
    <span className="text-3xl mr-4">{icon}</span>
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// Componente auxiliar para contenedor de gráficos mejorado
const ChartCard = ({ title, children, height = "h-80" }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg ${height} flex flex-col`}>
    <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
    <div className="flex-grow relative">{children}</div>
  </div>
);

export default WorkshopStats;
