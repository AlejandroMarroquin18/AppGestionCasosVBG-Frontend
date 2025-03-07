import React from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement,  LineElement, ArcElement, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, ArcElement,  LineElement, Title, Tooltip, Legend);

const WorkshopStats = () => {
  const indicators = {
    totalWorkshops: 12,
    virtualWorkshops: 7,
    inPersonWorkshops: 5,
    averageParticipants: 15,
  };

  const workshopData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Talleres por año',
      data: [11, 12, 12],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };

  const participantsData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Participantes por año',
      data: [100, 112, 98],
      backgroundColor: 'rgba(255, 206, 86, 0.6)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1,
    }]
  };

  const averageParticipantsData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Participantes promedio',
      data: [15, 16, 12],
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    }]
  };

  const participantsByFacultyData = {
    labels: ["Psicología", "Ingeniería", "Ciencias exactas", "Derecho", "Humanidades"],
    datasets: [{
      label: 'Estudiantes participantes por facultad',
      data: [12, 8, 10, 15, 12],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }]
  };

  const attendanceData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Tasa de asistencia (%)',
      data: [80, 85, 88],
      backgroundColor: 'rgba(139, 0, 0, 0.6)',
      borderColor: 'rgb(33, 2, 119)',
      borderWidth: 1,
    }]
  };

  const satisfactionData = {
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Satisfacción de los participantes',
      data: [4.0, 4.2, 4.3],
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
        data: [5, 6, 7],
        backgroundColor: 'rgba(12, 0, 122, 0.6)',
      },
      {
        label: 'Presencial',
        data: [6, 6, 5],
        backgroundColor: 'rgba(221, 23, 8, 0.6)',
      }
    ]
  };

  const genderData = {
    labels: ["Hombres", "Mujeres", "No binario"],
    datasets: [{
      label: 'Distribución de género',
      data: [40, 50, 10],
      backgroundColor: ['rgb(185, 124, 11)', 'rgba(0, 31, 133, 0.6)', 'rgba(233, 18, 11, 0.6)'],
    }]
  };

  const audienceData = {
    labels: ["Estudiantes", "Docentes", "Administrativos"],
    datasets: [{
      label: 'Participación por tipo de público',
      data: [70, 20, 10],
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
          family: 'Arial'
        }
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
          <Doughnut data={genderData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Distribución de género en participantes' } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Doughnut data={audienceData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Participación por tipo de público' } } }} />
        </div>
      </div>
    </div>
  );
};

export default WorkshopStats;