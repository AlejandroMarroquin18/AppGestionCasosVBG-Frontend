import React from "react";
import Statistics from '../../components/Statistics';

const WorkshopStats = () => {
  const principalIndicators = {
    totalWorkshops: 12,  
  };

  const secondaryIndicators = {
    virtualWorkshops: 7,
    inPersonWorkshops: 5,
    averageParticipants: 15,
  };

  const indicatorNames = {
    totalWorkshops: "Talleres realizados en el último año",
    virtualWorkshops: "Talleres virtuales",
    inPersonWorkshops: "Talleres presenciales",
    averageParticipants: "Participantes promedio",
  };

  const chartsData = [
    {
      data: {
        labels: ["2022", "2023", "2024"],
        datasets: [{
          label: 'Talleres por año',
          data: [11, 12, 12],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }]
      },
      title: "Talleres por año",
      type: "Line"
    },
    {
      data: {
        labels: ["2022", "2023", "2024"],
        datasets: [{
          label: 'Participantes por año',
          data: [100, 112, 98],
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        }]
      },
      title: "Participantes por año",
      type: "Line"
    },
    {
      data: {
        labels: ["2022", "2023", "2024"],
        datasets: [{
          label: 'Participantes promedio',
          data: [15, 16, 12],
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        }]
      },
      title: "Participantes promedio por año",
      type: "Line"
    },
    {
      data: {
        labels: ["Psicología", "Ingeniería", "Ciencias exactas", "Derecho", "Humanidades"],
        datasets: [{
          label: 'Estudiantes participantes por facultad',
          data: [12, 8, 10, 15, 12],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }]
      },
      title: "Estudiantes participantes por facultad en el último año",
      type: "Bar"
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
      title="Estadísticas de talleres"
      indicators={{ ...principalIndicators, ...secondaryIndicators }}
      indicatorNames={indicatorNames}
      chartsData={chartsData}
      options={options}
      numPrimaryColumns={Object.keys(principalIndicators).length}
      numSecondaryColumns={Object.keys(secondaryIndicators).length}
    />
  );
};

export default WorkshopStats;