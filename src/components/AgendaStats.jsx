import React, { useEffect, useState, useRef } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  LineController,
  BarController,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FiDownload, FiUsers, FiUser, FiUserCheck, FiCalendar, FiClock } from "react-icons/fi";
import { fetchEventStats } from "../api";
import LoadingSpinner from "./LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,       
  LineElement,        
  ArcElement,         
  LineController,
  BarController,
  DoughnutController,
  Title,
  Tooltip,
  Legend
);

const AgendaStats = () => {
  const [receivedData, setReceivedData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [conteofacultades, setConteofacultades] = useState({facultades:[],valores:[]});
  const [conteosPorGeneros, setConteosPorGenero] = useState({generos:[],valores:[]});
  const [conteoPorTipo, setConteoPorTipo] = useState({tipos:[],valores:[]});
  const [conteo_por_anio, setConteoPorAnio] = useState({anios:[],valores:[]});
  const [conteoPorMeses, setConteoPorMeses] = useState({meses:[],valores:[]});
  
  const mesesDelAnio = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  // Refs para los gráficos
  const chartRefs = {
    year: useRef(null),
    faculty: useRef(null),
    type: useRef(null),
    month: useRef(null),
    gender: useRef(null),
    completion: useRef(null)
  };

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEventStats();
        setReceivedData(data);
        
        // Procesar datos de facultades
        const facultadesList = data.conteo_por_facultad_afectado.map(item => 
          (item.case_id__afectado_facultad === '') || (item.case_id__afectado_facultad === null) ? 'No especificado' : item.case_id__afectado_facultad
        );
        const totalesFacultad = data.conteo_por_facultad_afectado.map(item => item.total_eventos);
        setConteofacultades({facultades: facultadesList, valores: totalesFacultad});
        
        // Procesar datos de géneros
        const generoList = data.conteo_por_genero_afectado.map(item => 
          (item.case_id__afectado_identidad_genero === '') || (item.case_id__afectado_identidad_genero === null) ? 'No especificado' : item.case_id__afectado_identidad_genero
        );
        const totalesGenero = data.conteo_por_genero_afectado.map(item => item.total);
        setConteosPorGenero({generos: generoList, valores: totalesGenero});
        
        // Procesar datos de tipo de evento
        const typeList = data.conteo_por_tipo.map(item => 
          (item.type === '') || (item.type === null) ? 'No especificado' : item.type
        );
        const totalesType = data.conteo_por_tipo.map(item => item.total);
        setConteoPorTipo({tipos: typeList, valores: totalesType});
        
        // Procesar datos por año
        const aniosList = data.conteo_por_anio.map(item => 
          (item.year === '') || (item.year === null) ? 'No especificado' : item.year
        );
        const totalesAnios = data.conteo_por_anio.map(item => item.total);
        setConteoPorAnio({anios: aniosList, valores: totalesAnios});
        
        // Procesar datos por mes
        const mesesList = data.conteo_por_mes.map(item => 
          (item.month === '') || (item.month === null) ? 'No especificado' : mesesDelAnio[item.month - 1]
        );
        const totalesMeses = data.conteo_por_mes.map(item => item.total);
        setConteoPorMeses({meses: mesesList, valores: totalesMeses});

      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
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

  const indicators = {
    requestedAppointments: receivedData.total_eventos_creados || 0,
    attendedAppointments: receivedData.total_eventos_realizados || 0,
    studentRequestedAppointments: receivedData.total_estudiantes || 0,
    staffRequestedAppointments: receivedData.total_funcionarios || 0,
    professorRequestedAppointments: receivedData.total_profesores || 0,
    studentAttendedAppointments: 6,
    staffAttendedAppointments: 4,
    professorAttendedAppointments: 1,
  };

  // Datos para los gráficos
  const appointmentsByYearData = {
    labels: conteo_por_anio.anios,
    datasets: [{
      label: 'Citas por Año',
      data: conteo_por_anio.valores,
      backgroundColor: 'rgba(239, 68, 68, 0.8)',
      borderColor: 'rgba(239, 68, 68, 1)',
      borderWidth: 2,
      tension: 0.4,
    }]
  };

  const completionRateData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Tasa de cumplimiento (%)',
      data: [85, 80, 90],
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 2,
      tension: 0.4,
    }]
  };

  const appointmentsByFacultyData = {
    labels: conteofacultades.facultades,
    datasets: [{
      label: 'Citas por facultad',
      data: conteofacultades.valores,
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
    }]
  };

  const appointmentReasonsData = {
    labels: conteoPorTipo.tipos,
    datasets: [{
      label: 'Motivos de citas',
      data: conteoPorTipo.valores,
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(245, 158, 11, 0.8)',
      ],
      borderWidth: 2,
    }]
  };

  const appointmentsByMonthData = {
    labels: conteoPorMeses.meses,
    datasets: [{
      label: 'Citas por mes',
      data: conteoPorMeses.valores,
      backgroundColor: 'rgba(168, 85, 247, 0.8)',
      borderColor: 'rgba(168, 85, 247, 1)',
      borderWidth: 2,
    }]
  };

  const appointmentsByGenderData = {
    labels: conteosPorGeneros.generos,
    datasets: [{
      label: 'Distribución por género',
      data: conteosPorGeneros.valores,
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(168, 85, 247, 0.8)',
      ],
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner message="Cargando estadísticas de citas..." size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📅 Estadísticas de agenda
          </h1>
          <p className="text-gray-600 text-sm">
            Resumen completo de las citas programadas y atendidas
          </p>
          <div className="w-20 h-1 bg-red-600 rounded-full mt-2"></div>
        </div>

        {/* Indicadores Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Citas Pedidas */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">📋 Citas pedidas</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiCalendar className="text-blue-500" />
                <span>Total solicitadas</span>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {indicators.requestedAppointments}
              </div>
              <p className="text-sm text-gray-600">Citas solicitadas en el último año</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <FiUsers className="mx-auto text-blue-600 mb-2" size={20} />
                <div className="text-lg font-bold text-gray-800">{indicators.studentRequestedAppointments}</div>
                <div className="text-xs text-gray-600">Estudiantes</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <FiUserCheck className="mx-auto text-green-600 mb-2" size={20} />
                <div className="text-lg font-bold text-gray-800">{indicators.staffRequestedAppointments}</div>
                <div className="text-xs text-gray-600">Funcionarios</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <FiUser className="mx-auto text-purple-600 mb-2" size={20} />
                <div className="text-lg font-bold text-gray-800">{indicators.professorRequestedAppointments}</div>
                <div className="text-xs text-gray-600">Profesores</div>
              </div>
            </div>
          </div>

          {/* Citas Atendidas */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">✅ Citas atendidas</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiClock className="text-green-500" />
                <span>Total completadas</span>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {indicators.attendedAppointments}
              </div>
              <p className="text-sm text-gray-600">Citas atendidas en el último año</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <FiUsers className="mx-auto text-blue-600 mb-2" size={20} />
                <div className="text-lg font-bold text-gray-800">{indicators.studentAttendedAppointments}</div>
                <div className="text-xs text-gray-600">Estudiantes</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <FiUserCheck className="mx-auto text-green-600 mb-2" size={20} />
                <div className="text-lg font-bold text-gray-800">{indicators.staffAttendedAppointments}</div>
                <div className="text-xs text-gray-600">Funcionarios</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <FiUser className="mx-auto text-purple-600 mb-2" size={20} />
                <div className="text-lg font-bold text-gray-800">{indicators.professorAttendedAppointments}</div>
                <div className="text-xs text-gray-600">Profesores</div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Evolución por Año */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">📈 Evolución por año</h3>
              <button
                onClick={() => downloadChart(chartRefs.year, 'citas-por-anio')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <FiDownload size={14} />
                Descargar
              </button>
            </div>
            <div className="h-64">
              <Line 
                ref={chartRefs.year}
                data={appointmentsByYearData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: false }
                  }
                }} 
              />
            </div>
          </div>

          {/* Citas por Facultad */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">🏛️ Citas por facultad</h3>
              <button
                onClick={() => downloadChart(chartRefs.faculty, 'citas-por-facultad')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <FiDownload size={14} />
                Descargar
              </button>
            </div>
            <div className="h-64">
              <Bar 
                ref={chartRefs.faculty}
                data={appointmentsByFacultyData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: false }
                  }
                }} 
              />
            </div>
          </div>

          {/* Motivos de Citas */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">🎯 Motivos de citas</h3>
              <button
                onClick={() => downloadChart(chartRefs.type, 'motivos-citas')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <FiDownload size={14} />
                Descargar
              </button>
            </div>
            <div className="h-64">
              <Doughnut 
                ref={chartRefs.type}
                data={appointmentReasonsData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: false }
                  }
                }} 
              />
            </div>
          </div>

          {/* Citas por Mes */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">📅 Citas por mes</h3>
              <button
                onClick={() => downloadChart(chartRefs.month, 'citas-por-mes')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <FiDownload size={14} />
                Descargar
              </button>
            </div>
            <div className="h-64">
              <Bar 
                ref={chartRefs.month}
                data={appointmentsByMonthData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: false }
                  }
                }} 
              />
            </div>
          </div>

          {/* Distribución por Género */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
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
            <div className="h-64">
              <Doughnut 
                ref={chartRefs.gender}
                data={appointmentsByGenderData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: false }
                  }
                }} 
              />
            </div>
          </div>

          {/* Tasa de Cumplimiento */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">📊 Tasa de cumplimiento</h3>
              <button
                onClick={() => downloadChart(chartRefs.completion, 'tasa-cumplimiento')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <FiDownload size={14} />
                Descargar
              </button>
            </div>
            <div className="h-64">
              <Line 
                ref={chartRefs.completion}
                data={completionRateData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: false }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Resumen General */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Resumen general de citas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{indicators.requestedAppointments}</div>
              <div className="text-sm text-gray-600">Citas solicitadas</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{indicators.attendedAppointments}</div>
              <div className="text-sm text-gray-600">Citas atendidas</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{conteo_por_anio.anios.length}</div>
              <div className="text-sm text-gray-600">Años de datos</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{conteofacultades.facultades.length}</div>
              <div className="text-sm text-gray-600">Facultades</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaStats;