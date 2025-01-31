import React from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AgendaStats = () => {
  const indicators = {
    requestedAppointments: 16,
    attendedAppointments: 11,
    studentRequestedAppointments: 7,
    staffRequestedAppointments: 5,
    professorRequestedAppointments: 4,
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
    labels: ["2022", "2023", "2024"],
    datasets: [{
      label: 'Citas por Año',
      data: [400, 450, 350],
      backgroundColor: 'rgba(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132)',
      borderWidth: 1,
    }]
  };

  const appointmentsByFacultyData = {
    labels: ["Artes", "Ciencias", "Ingeniería", "Medicina", "Derecho"],
    datasets: [{
      label: 'Citas por facultad',
      data: [100, 200, 150, 250, 100],
      backgroundColor: 'rgba(248, 148, 4)',
      borderColor: 'rgba(248, 148, 4)',
      borderWidth: 1,
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
          style: 'bold',
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
          style: 'bold',
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
        text: 'Citas por departamento',
        font: {
          size: 20,
          style: 'bold',
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
          <Bar data={appointmentsByFacultyData} options={optionsBar} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Doughnut data={appointmentsByDepartmentData} options={optionsDoughnut} />
        </div>
      </div>
    </div>
  );
};

export default AgendaStats;