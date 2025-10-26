import React, { useState, useEffect, useRef } from "react";
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
import { FiDownload, FiUsers, FiMonitor, FiHome, FiBarChart2 } from "react-icons/fi";
import { baseURL } from "../../api";
import getCSRFToken from "../../helpers/getCSRF";
import LoadingSpinner from "../../components/LoadingSpinner";

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

  // Refs para los gráficos
  const chartRefs = {
    modality: useRef(null),
    gender: useRef(null),
    program: useRef(null),
    age: useRef(null),
    ethnicity: useRef(null),
    disability: useRef(null)
  };

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

  // Función para descargar gráficos
  const downloadChart = (chartRef, filename) => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = chartRef.current.toBase64Image();
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner message="Cargando estadísticas de talleres..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar estadísticas</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No hay datos disponibles</h2>
          <p className="text-gray-600">No se encontraron estadísticas de talleres</p>
        </div>
      </div>
    );
  }

  // Configuración común para gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: "#fff",
        font: { weight: "bold", size: 12 },
        formatter: (value, ctx) => {
          if (ctx.chart.data.datasets[0].data.length > 5) {
            return value > 0 ? value : "";
          }
          const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${percentage}%`;
        },
      },
      legend: {
        position: "right",
        labels: {
          boxWidth: 12,
          padding: 15,
          font: { size: 11 },
        },
      },
    },
  };

  // Datos para los gráficos
  const modalityData = {
    labels: ["Virtuales", "Presenciales"],
    datasets: [
      {
        data: [stats.virtual_workshops, stats.in_person_workshops],
        backgroundColor: ["#3b82f6", "#ef4444"],
        borderWidth: 2,
      },
    ],
  };

  const genderData = {
    labels: stats.gender_stats?.map((item) => item.gender_identity || "No especificado") || [],
    datasets: [
      {
        data: stats.gender_stats?.map((item) => item.count) || [],
        backgroundColor: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
      },
    ],
  };

  const programData = {
    labels: stats.program_stats?.map((item) => item.program || "No especificado") || [],
    datasets: [
      {
        label: "Participantes",
        data: stats.program_stats?.map((item) => item.count) || [],
        backgroundColor: "#3b82f6",
        borderWidth: 0,
      },
    ],
  };

  const ageData = {
    labels: stats.age_stats?.map((item) => item.age_group) || [],
    datasets: [
      {
        label: "Participantes",
        data: stats.age_stats?.map((item) => item.count) || [],
        backgroundColor: "#10b981",
        borderWidth: 0,
      },
    ],
  };

  const ethnicityData = {
    labels: stats.ethnicity_stats?.map((item) => item.self_recognition || "No especificado") || [],
    datasets: [
      {
        data: stats.ethnicity_stats?.map((item) => item.count) || [],
        backgroundColor: ["#f59e0b", "#3b82f6", "#ef4444", "#10b981", "#8b5cf6"],
        borderWidth: 2,
      },
    ],
  };

  const disabilityData = {
    labels: stats.disability_stats?.map((item) => item.disability) || [],
    datasets: [
      {
        label: "Participantes",
        data: stats.disability_stats?.map((item) => item.count) || [],
        backgroundColor: "#8b5cf6",
        borderWidth: 0,
      },
    ],
  };

  const sedeData = {
    labels: stats.disability_stats?.map((item) => item.sede) || [],
    datasets: [
      {
        label: "Sedes",
        data: stats.disability_stats?.map((item) => item.count) || [],
        backgroundColor: "#8b5cf6",
        borderWidth: 0,
      },
    ],
  };

  return (
    // Contenedor principal que ocupa toda la pantalla
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full h-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full h-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🎯 Estadísticas de talleres
            </h1>
            <p className="text-gray-600 text-sm">
              Resumen completo de talleres programados y participación
            </p>
            <div className="w-20 h-1 bg-red-600 rounded-full mt-2"></div>
          </div>

          {/* Indicadores Principales */}
          <div className="w-full mb-8">
            {/* Indicador Principal */}
            <div className="w-full">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">📊 Total de talleres</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiBarChart2 className="text-red-500" />
                    <span>Último año</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    {stats.total_workshops}
                  </div>
                  <p className="text-sm text-gray-600">Talleres realizados en el último año</p>
                </div>

                {/* Indicadores Secundarios */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <FiMonitor className="mx-auto text-blue-600 mb-3" size={24} />
                    <div className="text-lg font-bold text-gray-800">{stats.virtual_workshops}</div>
                    <div className="text-xs text-gray-600">Talleres virtuales</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <FiHome className="mx-auto text-red-600 mb-3" size={24} />
                    <div className="text-lg font-bold text-gray-800">{stats.in_person_workshops}</div>
                    <div className="text-xs text-gray-600">Talleres presenciales</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <FiUsers className="mx-auto text-purple-600 mb-3" size={24} />
                    <div className="text-lg font-bold text-gray-800">{stats.total_participants}</div>
                    <div className="text-xs text-gray-600">Total participantes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráficos - Ocupan el resto del espacio */}
          <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Modalidad de Talleres */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">💻 Modalidad de talleres</h3>
                <button
                  onClick={() => downloadChart(chartRefs.modality, 'modalidad-talleres')}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <FiDownload size={14} />
                  Descargar
                </button>
              </div>
              <div className="h-80 w-full">
                <Doughnut
                  ref={chartRefs.modality}
                  data={modalityData}
                  options={chartOptions}
                />
              </div>
            </div>

            {/* Distribución por Género */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">⚧️ Distribución por género</h3>
                <button
                  onClick={() => downloadChart(chartRefs.gender, 'distribucion-genero')}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <FiDownload size={14} />
                  Descargar
                </button>
              </div>
              <div className="h-80 w-full">
                <Pie
                  ref={chartRefs.gender}
                  data={genderData}
                  options={chartOptions}
                />
              </div>
            </div>

            {/* Participantes por Programa Académico */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">🎓 Programas académicos</h3>
                <button
                  onClick={() => downloadChart(chartRefs.program, 'programas-academicos')}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <FiDownload size={14} />
                  Descargar
                </button>
              </div>
              <div className="h-80 w-full">
                <Bar
                  ref={chartRefs.program}
                  data={programData}
                  options={{
                    ...chartOptions,
                    indexAxis: "y",
                  }}
                />
              </div>
            </div>

            {/* Grupos de Edad */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">👥 Grupos de edad</h3>
                <button
                  onClick={() => downloadChart(chartRefs.age, 'grupos-edad')}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <FiDownload size={14} />
                  Descargar
                </button>
              </div>
              <div className="h-80 w-full">
                <Bar
                  ref={chartRefs.age}
                  data={ageData}
                  options={chartOptions}
                />
              </div>
            </div>

            {/* Autoreconocimiento Étnico */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">🌍 Autoreconocimiento étnico</h3>
                <button
                  onClick={() => downloadChart(chartRefs.ethnicity, 'autoreconocimiento-etnico')}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <FiDownload size={14} />
                  Descargar
                </button>
              </div>
              <div className="h-80 w-full">
                <Doughnut
                  ref={chartRefs.ethnicity}
                  data={ethnicityData}
                  options={chartOptions}
                />
              </div>
            </div>

            {/* Tipos de Discapacidad */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">♿ Tipos de discapacidad</h3>
                <button
                  onClick={() => downloadChart(chartRefs.disability, 'tipos-discapacidad')}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <FiDownload size={14} />
                  Descargar
                </button>
              </div>
              <div className="h-80 w-full">
                <Bar
                  ref={chartRefs.disability}
                  data={disabilityData}
                  options={{
                    ...chartOptions,
                    indexAxis: "y",
                  }}
                />
              </div>
            </div>
            {/* Sede */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800"> Talleres por sede</h3>
                <button
                  onClick={() => downloadChart(chartRefs.sede, 'sede')}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <FiDownload size={14} />
                  Descargar
                </button>
              </div>
              <div className="h-80 w-full">
                <Bar
                  ref={chartRefs.sede}
                  data={sedeData}
                  options={{
                    ...chartOptions,
                    indexAxis: "y",
                  }}
                />
              </div>
            </div>

          </div>

          {/* Información Adicional */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">📋 Resumen general</h3>
                <p className="text-sm text-gray-600">
                  Estadísticas completas de participación en talleres del último año
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Última actualización:{" "}
                  {stats.last_update ? new Date(stats.last_update).toLocaleString() : "No disponible"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopStats;