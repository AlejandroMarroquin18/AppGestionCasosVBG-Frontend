import React, { useEffect, useRef } from "react";
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
import { FiDownload, FiUsers, FiUser, FiUserCheck, FiTrendingUp } from "react-icons/fi";
import { getComplaintStats } from "../../api";
import LoadingSpinner from "../../components/LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const ComplaintsStats = () => {
  const [receivedData, setReceivedData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const currentYear = new Date().getFullYear();
  const [anios, setAnios] = React.useState(["2025"]);
  const [conteosPorAnio, setConteosPorAnio] = React.useState({});
  const [conteofacultades, setConteofacultades] = React.useState({facultades:[],valores:[]});
  const [conteosPorGeneros, setConteosPorGenero] = React.useState({generos:[],valores:[]});
  const [conteosPorSedes, setConteosPorSedes] = React.useState({sedes:[],valores:[]});
  const [conteosPorVicerrectorias, setConteosPorVicerrectorias] = React.useState({vicerrectorias:[],valores:[]});

  const [conteoPorEdades, setConteoPorEdades] = React.useState({edades:[],valores:[]});
  const [conteoPorComunas, setConteoPorComunas] = React.useState({comunas:[],valores:[]});
  const [conteosPorTipoVBG, setConteosPorTipoVBG] = React.useState({tipos:[],valores:[]});
  const [conteoPorFactores, setConteoPorFactores] = React.useState({factores:[],valores:[]});

  // Refs para los gráficos
  const chartRefs = {
    faculty: useRef(null),
    location: useRef(null),
    year: useRef(null),
    department: useRef(null),
    gender: useRef(null),
    edades: useRef(null),
    comunas: useRef(null),
    tipo_vbg: useRef(null),
    factores_riesgo: useRef(null),

  };

  useEffect(() => {
    const loadComplaintStats = async () => {
      setIsLoading(true);
      try {
        const data = await getComplaintStats();
        console.log("Complaint Statistics:", data);
        
        setReceivedData(data);
        setConteosPorAnio(data);

        // Procesar datos de facultades
        const facultadesList = data.conteo_por_facultad_afectado.map(item => 
          item.afectado_facultad === '' ? 'No especificado' : item.afectado_facultad
        );
        const totalesFacultad = data.conteo_por_facultad_afectado.map(item => item.total);
        setConteofacultades({facultades: facultadesList, valores: totalesFacultad});

        // Procesar datos de géneros
        const generoList = data.conteo_por_genero_afectado.map(item => 
          item.afectado_identidad_genero === '' ? 'No especificado' : item.afectado_identidad_genero
        );
        const totalesGenero = data.conteo_por_genero_afectado.map(item => item.total);
        setConteosPorGenero({generos: generoList, valores: totalesGenero});

        // Procesar datos de sedes
        const sedesList = data.conteo_por_sede_afectado.map(item => 
          item.afectado_sede === '' ? 'No especificado' : item.afectado_sede
        );
        const totalesSedes = data.conteo_por_sede_afectado.map(item => item.total);
        setConteosPorSedes({sedes: sedesList, valores: totalesSedes});

        // Procesar datos de vicerrectorías
        const vicesList = data.conteo_por_vicerrectoria_adscrita_afectado.map(item => 
          item.afectado_vicerrectoria_adscrito === '' ? 'No especificado' : item.afectado_vicerrectoria_adscrito
        );
        const totalVices = data.conteo_por_vicerrectoria_adscrita_afectado.map(item => item.total);
        setConteosPorVicerrectorias({vicerrectorias: vicesList, valores: totalVices});

        // Procesar datos de edades
        const edadesList = data.edades.map(item => 
          item.afectado_edad === '' ? 'No especificado' : item.afectado_edad
        );
        const totalEdades = data.edades.map(item => item.total);
        setConteoPorEdades({edades: edadesList, valores: totalEdades});
        // Procesar datos de comunas
        const comunasList = data.comuna.map(item => 
          item.afectado_comuna === '' ? 'No especificado' : item.afectado_comuna
        );
        const totalComunas = data.conteo_por_comuna_afectado.map(item => item.total);
        setConteoPorComunas({comunas: comunasList, valores: totalComunas});
        
        
        console.log("Tipo VBG data:", data.tipo_vbg);
        // Procesar datos de tipos de VBG
        setConteosPorTipoVBG({tipos:  Object.keys(data.tipo_vbg), valores: Object.values(data.tipo_vbg)});
        
        console.log("Factores de riesgo data:", data.factores_riesgo);
        // Procesar datos de factores de riesgo
        setConteoPorFactores({factores: Object.keys(data.factores_riesgo), valores: Object.values(data.factores_riesgo)});


        setAnios(Object.keys(data.conteo_por_anio));

      } catch (error) {
        console.error("Error loading complaint statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadComplaintStats();
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
    receivedComplaints: conteosPorAnio[currentYear] || 0,
    referredComplaints: 12, // Este dato debería venir del backend
    studentComplaints: receivedData.afectado_estudiantes || 0,
    staffComplaints: receivedData.afectado_funcionarios || 0,
    professorComplaints: receivedData.afectado_profesores || 0,
    studentReferrals: 7, // Este dato debería venir del backend
    staffReferrals: 3, // Este dato debería venir del backend
    professorReferrals: 2, // Este dato debería venir del backend
  };

  // Datos para los gráficos
  const complaintsByFacultyData = {
    labels: conteofacultades.facultades,
    datasets: [
      {
        label: "Quejas por facultad",
        data: conteofacultades.valores,
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
      },
    ],
  };

  const complaintsByGenderData = {
    labels: conteosPorGeneros.generos,
    datasets: [
      {
        label: "Distribución por género",
        data: conteosPorGeneros.valores,
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const complaintsByLocationData = {
    labels: conteosPorSedes.sedes,
    datasets: [
      {
        label: "Quejas por sede",
        data: conteosPorSedes.valores,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
    ],
  };

  const complaintsByYearData = {
    labels: anios,
    datasets: [
      {
        label: "Quejas por año",
        data: anios.map(anio => conteosPorAnio[anio] || 0),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const edadesData = {
    labels: conteoPorEdades.edades,
    datasets: [
      {
        label: "Quejas por edades",
        data: conteoPorEdades.valores,
        backgroundColor: "rgba(168, 85, 247, 0.8)",
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 2,
      },
    ],
  };

  const comunasData = {
    labels: conteoPorComunas.comunas,
    datasets: [
      {
        label: "Quejas por comunas",
        data: conteoPorComunas.valores,
        backgroundColor: "rgba(168, 85, 247, 0.8)",
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 2,
      },
    ],
  };
  const tipoVBGData = {
    labels: conteosPorTipoVBG.tipos,
    datasets: [
      {
        label: "Quejas por Tipos de violencia",
        data: conteosPorTipoVBG.valores,
        backgroundColor: "rgba(168, 85, 247, 0.8)",
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 2,
      },
    ],
  };
  const factoresRiesgoData = {
    labels: conteoPorFactores.factores,
    datasets: [
      {
        label: "Quejas por factores de riesgo",
        data: conteoPorFactores.valores,
        backgroundColor: "rgba(168, 85, 247, 0.8)",
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 2,
      },
    ],
  };
  const complaintsByDepartmentData = {
    labels: conteosPorVicerrectorias.vicerrectorias,
    datasets: [
      {
        label: "Quejas por vicerrectoría",
        data: conteosPorVicerrectorias.valores,
        backgroundColor: "rgba(168, 85, 247, 0.8)",
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 2,
      },
    ],
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
        <LoadingSpinner message="Cargando estadísticas..." size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📊 Estadísticas de quejas
          </h1>
          <p className="text-gray-600 text-sm">
            Resumen completo de las quejas y métricas del sistema
          </p>
          <div className="w-20 h-1 bg-red-600 rounded-full mt-2"></div>
        </div>

        {/* Indicadores Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quejas Recibidas */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">📨 Quejas Recibidas</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiTrendingUp className="text-green-500" />
                <span>Año {currentYear}</span>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {indicators.receivedComplaints}
              </div>
              <p className="text-sm text-gray-600">Total de quejas recibidas</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <FiUsers className="mx-auto text-red-600 mb-2" size={20} />
                <div className="text-lg font-bold text-gray-800">{indicators.studentComplaints}</div>
                <div className="text-xs text-gray-600">Estudiantes</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <FiUserCheck className="mx-auto text-blue-600 mb-2" size={20} />
                <div className="text-lg font-bold text-gray-800">{indicators.professorComplaints}</div>
                <div className="text-xs text-gray-600">Profesores</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <FiUser className="mx-auto text-green-600 mb-2" size={20} />
                <div className="text-lg font-bold text-gray-800">{indicators.staffComplaints}</div>
                <div className="text-xs text-gray-600">Funcionarios</div>
              </div>
            </div>
          </div>

          {/* Quejas Remitidas */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">🔄 Quejas Remitidas</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiTrendingUp className="text-green-500" />
                <span>Año {currentYear}</span>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {indicators.referredComplaints}
              </div>
              <p className="text-sm text-gray-600">Total de quejas remitidas</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <FiUsers className="mx-auto text-red-600 mb-2" size={20} />
                <div className="text-lg font-bold text-gray-800">{indicators.studentReferrals}</div>
                <div className="text-xs text-gray-600">Estudiantes</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <FiUserCheck className="mx-auto text-blue-600 mb-2" size={20} />
                <div className="text-lg font-bold text-gray-800">{indicators.professorReferrals}</div>
                <div className="text-xs text-gray-600">Profesores</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <FiUser className="mx-auto text-green-600 mb-2" size={20} />
                <div className="text-lg font-bold text-gray-800">{indicators.staffReferrals}</div>
                <div className="text-xs text-gray-600">Funcionarios</div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quejas por Facultad */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">🏛️ Quejas por Facultad</h3>
              <button
                onClick={() => downloadChart(chartRefs.faculty, 'quejas-por-facultad')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <FiDownload size={14} />
                Descargar
              </button>
            </div>
            <div className="h-64">
              <Bar 
                ref={chartRefs.faculty}
                data={complaintsByFacultyData} 
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

          {/* Quejas por Sede */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">📍 Quejas por Sede</h3>
              <button
                onClick={() => downloadChart(chartRefs.location, 'quejas-por-sede')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <FiDownload size={14} />
                Descargar
              </button>
            </div>
            <div className="h-64">
              <Bar 
                ref={chartRefs.location}
                data={complaintsByLocationData} 
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

          {/* Evolución por Año */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">📈 Evolución por Año</h3>
              <button
                onClick={() => downloadChart(chartRefs.year, 'evolucion-quejas')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <FiDownload size={14} />
                Descargar
              </button>
            </div>
            <div className="h-64">
              <Line 
                ref={chartRefs.year}
                data={complaintsByYearData} 
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
              <h3 className="text-lg font-semibold text-gray-800">⚧️ Distribución por Género</h3>
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
                data={complaintsByGenderData} 
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

          {/* Quejas por Vicerrectoría */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">🏢 Quejas por Vicerrectoría</h3>
              <button
                onClick={() => downloadChart(chartRefs.department, 'quejas-por-vicerrectoria')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <FiDownload size={14} />
                Descargar
              </button>
            </div>
            <div className="h-64">
              <Bar 
                ref={chartRefs.department}
                data={complaintsByDepartmentData} 
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

          {/** E                                    spacio para futuros gráficos */}
          {/* edades */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800"> Quejas por edades</h3>
              <button
                onClick={() => downloadChart(chartRefs.edades, 'quejas-por-edades')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <FiDownload size={14} />
                Descargar
              </button>
            </div>
            <div className="h-64">
              <Bar 
                ref={chartRefs.edades}
                data={edadesData} 
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
          {/* Comunas */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">🏛️ Quejas por comuna</h3>
              <button
                onClick={() => downloadChart(chartRefs.comunas, 'quejas-por-comunas')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <FiDownload size={14} />
                Descargar
              </button>
            </div>
            <div className="h-64">
              <Bar 
                ref={chartRefs.comunas}
                data={comunasData} 
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
          {/* Quejas por Tipo VBG */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">🏛️ Quejas por tipo de violencia</h3>
              <button
                onClick={() => downloadChart(chartRefs.tipo_vbg, 'quejas-por-tipo-vbg')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <FiDownload size={14} />
                Descargar
              </button>
            </div>
            <div className="h-64">
              <Bar 
                ref={chartRefs.tipo_vbg}
                data={tipoVBGData} 
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
          {/* Quejas por Factores de riesgo */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">🏛️ Quejas por factores de riesgo</h3>
              <button
                onClick={() => downloadChart(chartRefs.factores_riesgo, 'quejas-por-factores-riesgo')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <FiDownload size={14} />
                Descargar
              </button>
            </div>
            <div className="h-64">
              <Bar 
                ref={chartRefs.factores_riesgo}
                data={factoresRiesgoData} 
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Resumen General</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{indicators.receivedComplaints}</div>
              <div className="text-sm text-gray-600">Quejas Totales</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{indicators.studentComplaints}</div>
              <div className="text-sm text-gray-600">Quejas Estudiantes</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{indicators.referredComplaints}</div>
              <div className="text-sm text-gray-600">Quejas Remitidas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsStats;