import React, { useEffect } from "react";
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

import { getComplaintStats } from "../../api";
import { use } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ComplaintsStats = () => {
  const [receivedData, setReceivedData] = React.useState({});
  const currentYear = new Date().getFullYear();
  const [anios, setAnios]= React.useState(["2025"]);
  const [conteosPorAnio, setConteosPorAnio] = React.useState({});
  const [conteofacultades, setConteofacultades] = React.useState({facultades:[],valores:[]});
  const [conteosPorGeneros, setConteosPorGenero] = React.useState({generos:[],valores:[]});
  const [conteosPorSedes, setConteosPorSedes] = React.useState({sedes:[],valores:[]});

  const [conteosPorVicerrectorias, setConteosPorVicerrectorias] = React.useState({vicerrectorias:[],valores:[]});
  

  useEffect(() => {
    const loadComplaintStats = async () => {
      try {
        const data = await getComplaintStats();
        console.log("Complaint Statistics:", data);
        
        setReceivedData(data);
        setConteosPorAnio(data.conteo_por_anio);

        //estos atibutos dentro de data son arrays de objetos, por lo que se pueden mapear en un orden especifico
        //facultades
        const facultadesList = data.conteo_por_facultad_afectado.map(item => item.afectado_facultad===''?'No especificado':item.afectado_facultad);
        const totalesFacultad = data.conteo_por_facultad_afectado.map(item => item.total);
        setConteofacultades({facultades:facultadesList, valores: totalesFacultad});
        //generos
        const generoList = data.conteo_por_genero_afectado.map(item => item.afectado_identidad_genero===''?'No especificado':item.afectado_identidad_genero);
        const totalesGenero = data.conteo_por_genero_afectado.map(item => item.total);
        setConteosPorGenero({generos:generoList, valores: totalesGenero});
        //sedes
        const sedesList = data.conteo_por_sede_afectado.map(item => item.afectado_sede===''?'No especificado':item.afectado_sede);
        const totalesSedes = data.conteo_por_sede_afectado.map(item => item.total);
        setConteosPorSedes({sedes:sedesList, valores: totalesSedes});
        //vicerrectorias
        const vicesList = data.conteo_por_vicerrectoria_adscrita_afectado.map(item => item.afectado_vicerrectoria_adscrito===''?'No especificado':item.afectado_vicerrectoria_adscrito);
        const totalVices = data.conteo_por_vicerrectoria_adscrita_afectado.map(item => item.total);
        setConteosPorVicerrectorias({vicerrectorias:vicesList, valores: totalVices});

        
        

        setAnios(Object.keys(data.conteo_por_anio));


      } catch (error) {
        console.error("Error loading complaint statistics:", error);
      }
    }
    loadComplaintStats();
    


  }, []);


  const indicators = {
    receivedComplaints: conteosPorAnio[currentYear],
    referredComplaints: 12,

    studentComplaints: receivedData.afectado_estudiantes,
    staffComplaints: receivedData.afectado_funcionarios,
    professorComplaints: receivedData.afectado_profesores,
    
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
    labels: conteofacultades.facultades,
    datasets: [
      {
        label: "Quejas por facultad",
        data: conteofacultades.valores,
        backgroundColor: "rgba(40, 92, 164)",
        borderColor: "rgba(40, 92, 164)",
        borderWidth: 1,
      },
    ],
  };

  const complaintsByGenderData = {
    //labels: ["Masculino", "Femenino", "No Binario"],
    labels: conteosPorGeneros.generos,
    datasets: [
      {
        label: "Distribución de quejas por género",
        data: conteosPorGeneros.valores,
        backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)", "rgba(255, 206, 86, 0.8)"],
      },
    ],
  };

  const complaintsByLocationData = {
    labels: conteosPorSedes.sedes,
    datasets: [
      {
        label: "Quejas por sede",
        data: conteosPorSedes.valores,
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
    labels: anios,
    datasets: [
      {
        label: "Quejas por año",
        data:  anios.map(anio => conteosPorAnio[anio] || 0),
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const complaintsByDepartmentData = {
    labels: conteosPorVicerrectorias.vicerrectorias,
    datasets: [
      {
        label: "Quejas por departamento",
        data: conteosPorVicerrectorias.valores,
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const optionsGender = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        font: {
          size: 20, 
          //style: 'bold', 
          family: 'Arial'
        }
      },
    },
  }


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
          //style: 'bold', 
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
        <div className="bg-white p-4 rounded shadow">
          <Doughnut data={complaintsByGenderData} options={{ ...optionsGender, plugins: { ...optionsGender.plugins, title: { ...optionsGender.plugins.title, text: 'Distribución de quejas por género' } } }} />
        </div>
      </div>
      </div>
  );
};

export default ComplaintsStats;