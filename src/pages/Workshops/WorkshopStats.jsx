import React from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement,  LineElement, ArcElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ChartDataLabels, CategoryScale, LinearScale, BarElement, PointElement, ArcElement, LineElement, Title, Tooltip, Legend);

const calculatePercentage = (data) => {
  const total = data.reduce((acc, value) => acc + value, 0); // Suma de todos los valores
  return data.map(value => Math.round((value / total) * 100)); // Calcula el porcentaje
};

const workshopDataPercentages = calculatePercentage([11, 12, 12]);
const participantsDataPercentages = calculatePercentage([100, 112, 98]);
const averageParticipantsDataPercentages = calculatePercentage([15, 16, 12]);
const participantsByFacultyDataPercentages = calculatePercentage([12, 8, 10, 15, 12]);
const attendanceDataPercentages = calculatePercentage([80, 85, 88]);
const satisfactionDataPercentages = calculatePercentage([4.0, 4.2, 4.3]);
const modalityDataPercentages = calculatePercentage([5, 6, 7, 6, 6, 5]);

const WorkshopStats = () => {
  const indicators = {
    totalWorkshops: 12,
    virtualWorkshops: 7,
    inPersonWorkshops: 5,
    averageParticipants: 15,
  };

  const sexData = calculatePercentage([40, 50, 10]); 
  const genderIdentityData = calculatePercentage([35, 15, 10, 5, 20]);

  const workshopData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Talleres por año',
      data: workshopDataPercentages, 
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };

  const participantsData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Participantes por año',
      data: participantsDataPercentages, // Usamos los porcentajes calculados
      backgroundColor: 'rgba(255, 206, 86, 0.6)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1,
    }]
  };

  const averageParticipantsData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Participantes promedio',
      data: averageParticipantsDataPercentages, // Usamos los porcentajes calculados
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    }]
  };

  const participantsByFacultyData = {
    labels: ["Psicología", "Ingeniería", "Ciencias exactas", "Derecho", "Humanidades"],
    datasets: [{
      label: 'Estudiantes participantes por facultad',
      data: participantsByFacultyDataPercentages, // Usamos los porcentajes calculados
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }]
  };

  const attendanceData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Tasa de asistencia (%)',
      data: attendanceDataPercentages, // Usamos los porcentajes calculados
      backgroundColor: 'rgba(139, 0, 0, 0.6)',
      borderColor: 'rgb(33, 2, 119)',
      borderWidth: 1,
    }]
  };

  const satisfactionData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Satisfacción de los participantes',
      data: satisfactionDataPercentages, // Usamos los porcentajes calculados
      backgroundColor: 'rgba(189, 6, 6, 0.6)',
      borderColor: 'rgba(189, 6, 6, 0.6)',
      borderWidth: 1,
    }]
  };

  const modalityData = {
    labels: ["2022", "2023", "2024"],
    datasets: [
      {
        label: 'Virtual',
        data: modalityDataPercentages.slice(0, 3), // Porcentaje de modalidad virtual
        backgroundColor: 'rgba(12, 0, 122, 0.6)',
      },
      {
        label: 'Presencial',
        data: modalityDataPercentages.slice(3), // Porcentaje de modalidad presencial
        backgroundColor: 'rgba(221, 23, 8, 0.6)',
      }
    ]
  };

  const sexDataChart = {
    labels: ["Mujer", "Hombre", "Intersexual", "No responde"],
    datasets: [{
      label: 'Distribución de personas participantes en talleres por sexo',
      data: sexData, 
      backgroundColor: ['rgb(185, 124, 11)', 'rgba(0, 31, 133, 0.6)', 'rgba(233, 18, 11, 0.6)', 'rgba(100, 100, 100, 0.6)'],
    }]
  };

  const genderIdentityChart = {
    labels: ["Cisgénero", "Transgénero", "Género fluido", "No binario y/o queer", "No responde"],
    datasets: [{
      label: 'Distribución de personas participantes en talleres por identidad de género',
      data: genderIdentityData, 
      backgroundColor: ['rgba(241, 29, 75, 0.6)', 'rgba(54, 163, 235, 0.44)', 'rgba(179, 31, 31, 0.49)', 'rgba(153, 102, 255, 0.6)', 'rgba(70, 233, 6, 0.56)'],
    }]
  };

  const audienceData = {
    labels: ["Estudiantes", "Docentes", "Administrativos"],
    datasets: [{
      label: 'Participación por tipo de público',
      data: calculatePercentage([70, 20, 10]), // Calculamos el porcentaje
      backgroundColor: ['rgb(211, 105, 6)', 'rgba(0, 31, 133, 0.6)', 'rgba(233, 18, 11, 0.6)'],
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        font: {
          size: 20,
          style: 'bold',
          family: 'Arial',
        },
      },
      datalabels: {
        color: 'white',
        font: {
          weight: 'bold',
          size: 24, // Tamaño de la fuente más grande
        },
        formatter: (value) => `${value}%`, // Convertir a porcentaje
        anchor: 'center',
        align: 'center',
      },
    },
  };

  return (
    <div className="w-full p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Estadísticas de talleres</h1>

      <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
        <div className="bg-blue-200 p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Talleres realizados en el último año</h2>
          <p className="text-3xl font-bold">{indicators.totalWorkshops}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-blue-100 p-4 rounded shadow text-center">
            <h2 className="text-lg font-semibold">Talleres virtuales</h2>
            <p className="text-2xl font-bold">{indicators.virtualWorkshops}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded shadow text-center">
            <h2 className="text-lg font-semibold">Talleres presenciales</h2>
            <p className="text-2xl font-bold">{indicators.inPersonWorkshops}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded shadow text-center">
            <h2 className="text-lg font-semibold">Participantes promedio</h2>
            <p className="text-2xl font-bold">{indicators.averageParticipants}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <Line data={workshopData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Talleres por año' } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Line data={participantsData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Participantes por año' } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Line data={averageParticipantsData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Participantes promedio por año' } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Bar data={participantsByFacultyData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Estudiantes participantes por facultad en el último año' } } }} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <Line data={attendanceData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Tasa de asistencia por año' } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Line data={satisfactionData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Satisfacción de los participantes' } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Bar data={modalityData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Evolución de asistencia por modalidad' } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Doughnut data={sexDataChart} options={options} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Doughnut data={genderIdentityChart} options={options} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Doughnut data={audienceData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Participación por tipo de público' } } }} />
        </div>
      </div>
    </div>
  );
};

export default WorkshopStats;