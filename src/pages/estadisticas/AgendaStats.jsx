import React from "react";
import Statistics from '../../components/Statistics';

const AgendaStats = () => {
  const principalIndicators = {
    requestedAppointments: 16,
    attendedAppointments: 11,
  };

  const secondaryIndicators = {
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

  const chartsData = [
    {
      data: {
        labels: ["2022", "2023", "2024"],
        datasets: [{
          label: 'Citas por Año',
          data: [400, 450, 350],
          backgroundColor: 'rgba(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132)',
          borderWidth: 1,
        }]
      },
      title: "Citas por año",
      type: "Line"
    },
    {
      data: {
        labels: ["Artes", "Ciencias", "Ingeniería", "Medicina", "Derecho"],
        datasets: [{
          label: 'Citas por facultad',
          data: [100, 200, 150, 250, 100],
          backgroundColor: 'rgba(248, 148, 4)',
          borderColor: 'rgba(248, 148, 4)',
          borderWidth: 1,
        }]
      },
      title: "Citas por facultad",
      type: "Bar"
    },
    {
      data: {
        labels: ["Bienestar", "Académica", "Investigaciones"],
        datasets: [{
          label: 'Citas por departamento',
          data: [300, 400, 500],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }]
      },
      title: "Citas por departamento",
      type: "Doughnut"
    }
  ];

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
    <Statistics
      title="Estadísticas de citas"
      indicators={{ ...principalIndicators, ...secondaryIndicators }}
      indicatorNames={indicatorNames}
      chartsData={chartsData}
      options={options}
      numPrimaryColumns={Object.keys(principalIndicators).length}
      numSecondaryColumns={Object.keys(secondaryIndicators).length}
    />
  );
};

export default AgendaStats;