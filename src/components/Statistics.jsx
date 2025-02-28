import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, ArcElement, LineElement, Title, Tooltip, Legend);

const ChartComponent = ({
  data,
  options,
  type 
}) => {
  const Component = {
    Bar: Bar,
    Line: Line,
    Doughnut: Doughnut,
  }[type];

  return (
    <div className="bg-white p-4 rounded shadow">
      <Component data={data} options={options} />
    </div>
  );
};

const Statistics = ({
  title,
  indicators,
  indicatorNames,
  chartsData,
  options,
  numPrimaryColumns,
  numSecondaryColumns
}) => {
  console.log(`Primary cols: ${numPrimaryColumns}, Secondary cols: ${numSecondaryColumns}`);

  // Asegurarse de que las clases dinámicas de Tailwind son validadas correctamente.
  const primaryGridClass = `grid grid-cols-${numPrimaryColumns} gap-4 mb-8`;
  const secondaryGridClass = `grid grid-cols-${numSecondaryColumns} gap-4`;

  console.log(primaryGridClass);
  console.log(secondaryGridClass);

  return (
    <div className="w-full p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="grid grid-cols-2 p-3">
        {Object.keys(indicators).slice(0, numPrimaryColumns).map((key, index) => (
          <div key={index} className="bg-blue-200 p-4 rounded shadow text-center">
            <h2 className="text-xl font-semibold">{indicatorNames[key]}</h2>
            <p className="text-3xl font-bold">{indicators[key]}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6 p-3">
        {Object.keys(indicators).slice(numPrimaryColumns).map((key, index) => (
          <div key={index} className="bg-green-200 p-4 rounded shadow text-center">
            <h2 className="text-xl font-semibold">{indicatorNames[key]}</h2>
            <p className="text-xl font-bold">{indicators[key]}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartsData.map((chart, index) => (
          <ChartComponent
            key={index}
            data={chart.data}
            options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: chart.title, font: { size: 20, style: 'normal', family: 'Arial' } } } }}
            type={chart.type}
          />
        ))}
      </div>
    </div>
  );
};

export default Statistics;