// ChartComponent.jsx
import React, { useEffect, useRef } from "react";
import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import 'chartjs-plugin-zoom';

const ChartComponent = ({ graphData }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartRef.current && graphData.length > 0) {
      const ctx = chartRef.current.getContext('2d');

      const dates = graphData.map(entry => new Date(entry.date_entree));
      const pes = graphData.map(entry => parseFloat(entry.PE));

      const data = {
        labels: dates,
        datasets: [
          {
            label: 'Point d entrée clé marché non-asiate',
            data: pes,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
        ],
      };

      const options = {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
            title: {
              display: true,
              text: 'Date d\'entrée',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'PE',
            },
          },
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'x',
            },
            pan: {
              enabled: true,
              mode: 'x',
            },
          },
        },
      };

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options,
      });
    }
  }, [chartRef, graphData]);

  useEffect(() => {
    console.log('Canvas Dimensions:', chartRef.current.width, chartRef.current.height);
  }, [chartRef.current]);

  return <canvas ref={chartRef} className="my-chart-canvas"></canvas>;
};

export default ChartComponent;