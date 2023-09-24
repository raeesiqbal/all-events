import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Row } from "react-bootstrap";

const LineChart = ({ chartData, label, period }) => {
  const { data, labels } = chartData;

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: label,
        font: {
          size: 24,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
        title: {
          display: true,
          text: "Total count",
        },
        ticks: {
          stepSize: 1,
          callback: (value) => (Number.isInteger(value) ? value : ""),
        },
      },
    },
  };

  return (
    <Row className="mb-5">
      <Line
        options={options}
        data={{
          labels,
          datasets: [
            {
              label: period,
              data,
              borderColor: "rgba(106, 200, 99, 1)",
              backgroundColor: "rgba(106, 200, 99, 1)",
            },
          ],
        }}
        style={{ height: "400px" }}
      />
    </Row>
  );
};

export default LineChart;
