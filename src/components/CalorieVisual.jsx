import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineGraph () {
 
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'], // X-axis labels
    datasets: [
      {
        label: 'Calories', // Label for the line
        data: [65, 59, 80, 81, 56, 55, 40], // Y-axis data
        fill: false,
        borderColor: 'rgb(75, 192, 192)', // Line color
        tension: 0.1, // Smooth curve
      },
    ],
  };


  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Calories Over Time', // Title of the chart
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Data Visualization</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraph;