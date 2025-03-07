import React from 'react';
import Statistics from '../../components/Statistics';

const ComplaintStats = () => {
  const principalIndicators = {
    receivedComplaints: 32,
    referredComplaints: 12,
  };

  const secondaryIndicators = {
    studentComplaints: 18,
    staffComplaints: 4,
    professorComplaints: 10,
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

  const indicators = { ...principalIndicators, ...secondaryIndicators };

  const chartsData = [
    {
      data: {
        labels: ["Artes", "Ciencias", "Ingeniería", "Medicina", "Derecho"],
        datasets: [
          {
            label: "Quejas por facultad",
            data: [50, 70, 40, 80, 80],
            backgroundColor: "rgba(40, 92, 164)",
            borderColor: "rgba(40, 92, 164)",
            borderWidth: 1,
          },
        ],
      },
      title: "Quejas por facultad",
      type: "Bar"
    },
    {
      data: {
        labels: ["Melendez", "San Fernando", "Buga"],
        datasets: [
          {
            label: "Quejas por sede",
            data: [120, 100, 100],
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
      },
      title: "Quejas por sede",
      type: "Bar"
    },
    {
      data: {
        labels: ["2022", "2023", "2024"],
        datasets: [
          {
            label: "Quejas por año",
            data: [30, 38, 32],
            backgroundColor: "rgba(153, 102, 255, 0.5)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      },
      title: "Quejas por año",
      type: "Line"
    },
    {
      data: {
        labels: ["Bienestar", "Académica", "Investigaciones"],
        datasets: [
          {
            label: "Quejas por departamento",
            data: [20, 13, 10],
            backgroundColor: "rgba(255, 159, 64, 0.5)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
        ],
      },
      title: "Quejas por departamento",
      type: "Doughnut"
    }
  ];

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
          style: 'bold',
          family: 'Arial'
        }
      },
    },
  };

  return (
    <Statistics
      title="Estadísticas de quejas"
      indicators={{ ...principalIndicators, ...secondaryIndicators }}
      indicatorNames={indicatorNames}
      chartsData={chartsData}
      options={options}
      numPrimaryColumns={Object.keys(principalIndicators).length}
      numSecondaryColumns={Object.keys(secondaryIndicators).length}
    />
  );
};

export default ComplaintStats;