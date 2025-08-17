import React, { useEffect, useState } from "react";
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
import { fetchEventStats } from "../api";

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


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AgendaStats = () => {
  const [receivedData,setReceivedData]= useState({});
  const [conteofacultades, setConteofacultades] = React.useState({facultades:[],valores:[]});
  const [conteosPorGeneros, setConteosPorGenero] = React.useState({generos:[],valores:[]});
  const [conteoPorTipo, setConteoPorTipo] = React.useState({tipos:[],valores:[]});
  const [conteo_por_anio, setConteoPorAnio] = React.useState({anios:[],valores:[]});
  const [conteoPorMeses, setConteoPorMeses] = React.useState({meses:[],valores:[]});
  
  const mesesDelAnio = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  useEffect(() => {

    const fetchStats = async () => {
      try {
        const data = await fetchEventStats();
        setReceivedData(data);
        //facultades
        const facultadesList = data.conteo_por_facultad_afectado.map(item => (item.case_id__afectado_facultad==='') || (item.case_id__afectado_facultad===null) ?'No especificado':item.case_id__afectado_facultad);
        const totalesFacultad = data.conteo_por_facultad_afectado.map(item => item.total_eventos);
        setConteofacultades({facultades:facultadesList, valores: totalesFacultad});
        //generos
        const generoList = data.conteo_por_genero_afectado.map(item => (item.case_id__afectado_identidad_genero==='') || (item.case_id__afectado_identidad_genero===null)?'No especificado':item.case_id__afectado_identidad_genero);
        const totalesGenero = data.conteo_por_genero_afectado.map(item => item.total);
        setConteosPorGenero({generos:generoList, valores: totalesGenero});
        //tipo de evento
        const typeList = data.conteo_por_tipo.map(item => (item.type==='') || (item.type===null)?'No especificado':item.type);
        const totalesType = data.conteo_por_tipo.map(item => item.total);
        setConteoPorTipo({tipos:typeList, valores: totalesType});
        //conteo por anio
        const aniosList = data.conteo_por_anio.map(item => (item.year==='') || (item.year===null)?'No especificado':item.year);
        const totalesAnios = data.conteo_por_anio.map(item => item.total);
        setConteoPorAnio({anios:aniosList, valores: totalesAnios});
        //conteo por mes
        const mesesList = data.conteo_por_mes.map(item => (item.month==='') || (item.month===null)?'No especificado':mesesDelAnio[item.month-1]);
        const totalesMeses = data.conteo_por_mes.map(item => item.total);
        setConteoPorMeses({meses:mesesList, valores: totalesMeses});





        console.log("Fetched stats:", receivedData);
        
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
    
  }, []);
  
  const indicators = {
    requestedAppointments: receivedData.total_eventos_creados,
    attendedAppointments: receivedData.total_eventos_realizados,
    studentRequestedAppointments: receivedData.total_estudiantes,
    staffRequestedAppointments: receivedData.total_funcionarios,
    professorRequestedAppointments: receivedData.total_profesores,
    studentAttendedAppointments: 6,
    staffAttendedAppointments: 4,
    professorAttendedAppointments: 1,
  };

  const indicatorNames = {
    requestedAppointments: "Citas pedidas en el último año",
    attendedAppointments: "Citas atendidas en el último año",
    studentRequestedAppointments: "Citas de estudiantes",
    staffRequestedAppointments: "Citas de funcionarios",
    professorRequestedAppointments: "Citas de profesores",
    studentAttendedAppointments: "Citas de estudiantes",
    staffAttendedAppointments: "Citas de funcionarios",
    professorAttendedAppointments: "Citas de profesores",
  };

  const appointmentsByYearData = {
    labels: conteo_por_anio.anios,
    datasets: [{
      label: 'Citas por Año',
      data: conteo_por_anio.valores,
      backgroundColor: 'rgba(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132)',
      borderWidth: 1,
    }]
  };

  const completionRateData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Tasa de cumplimiento (%)',
      data: [85, 80, 90],
      backgroundColor: 'rgba(0, 128, 255, 0.8)',
      borderColor: 'rgba(0, 128, 255, 1)',
      borderWidth: 1,
    }]
  };

  const appointmentsByFacultyData = {
    labels: conteofacultades.facultades,
    datasets: [{
      label: 'Citas por facultad',
      data: conteofacultades.valores,
      backgroundColor: 'rgba(248, 148, 4)',
      borderColor: 'rgba(248, 148, 4)',
      borderWidth: 1,
    }]
  };

  const appointmentReasonsData = {
    labels: conteoPorTipo.tipos,
    datasets: [{
      label: 'Motivos de citas',
      data: conteoPorTipo.valores,
      backgroundColor: ['rgba(128, 0, 128, 0.8)', 'rgba(255, 215, 0, 0.8)'],
    }]
  };

  const appointmentsByDepartmentData = {
    labels: ["Bienestar", "Académica", "Investigaciones"],
    datasets: [{
      label: 'Citas por departamento',
      data: [300, 400, 500],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };

  const appointmentsByMonthData = {
    labels: conteoPorMeses.meses,
    datasets: [{
      label: 'Citas por mes',
      data: conteoPorMeses.valores,
      backgroundColor: 'rgba(220, 20, 60, 0.8)',
      borderColor: 'rgba(220, 20, 60, 1)',
      borderWidth: 1,
    }]
  };

  const appointmentsByGenderData = {
    labels: conteosPorGeneros.generos,
    datasets: [{
      label: 'Distribución de citas por género',
      data: conteosPorGeneros.valores,
      backgroundColor: ['rgba(30, 144, 255, 0.8)', 'rgba(255, 105, 180, 0.8)', 'rgba(8, 98, 114, 0.8)'],
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, font: { size: 20, family: 'Arial' } }
    },
  };

  const optionsLine = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolución anual de citas',
        font: {
          size: 20,
          family: 'Arial'
        }
      },
    },
  };

  const optionsBar = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Citas por facultad',
        font: {
          size: 20,
          family: 'Arial'
        }
      },
    },
  };

  const optionsDoughnut = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Citas por de funcionarios por departamento',
        font: {
          size: 20,
          family: 'Arial'
        }
      },
    },
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Estadísticas de citas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Citas Pedidas y Atendidas */}
        <div>
          <div className="bg-blue-200 p-4 rounded shadow text-center">
            <h2 className="text-xl font-semibold">{indicatorNames.requestedAppointments}</h2>
            <p className="text-3xl font-bold">{indicators.requestedAppointments}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {["studentRequestedAppointments", "staffRequestedAppointments", "professorRequestedAppointments"].map((key) => (
              <div key={key} className="bg-blue-100 p-4 rounded shadow text-center">
                <h2 className="text-lg font-semibold">{indicatorNames[key]}</h2>
                <p className="text-2xl font-bold">{indicators[key]}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-green-200 p-4 rounded shadow text-center">
            <h2 className="text-xl font-semibold">{indicatorNames.attendedAppointments}</h2>
            <p className="text-3xl font-bold">{indicators.attendedAppointments}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {["studentAttendedAppointments", "staffAttendedAppointments", "professorAttendedAppointments"].map((key) => (
              <div key={key} className="bg-green-100 p-4 rounded shadow text-center">
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
          <Line data={appointmentsByYearData} options={optionsLine} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Line data={completionRateData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Tasa de cumplimiento de citas por año' } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Bar data={appointmentsByFacultyData} options={optionsBar} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Doughnut data={appointmentsByDepartmentData} options={optionsDoughnut} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Doughnut data={appointmentReasonsData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Razones más comunes para agendar citas' } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Bar data={appointmentsByMonthData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Frecuencia de citas por mes' } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Doughnut data={appointmentsByGenderData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Distribución de citas entre hombres y mujeres' } } }} />
        </div>
      </div>
    </div>
  );
};

export default AgendaStats;