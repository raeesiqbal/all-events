import React, { useEffect, useState } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const LineChart = ({ period, analytics }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
        title: {
          display: false,
        },
        ticks: {
          stepSize: 1,
          callback: (value) => (Number.isInteger(value) ? value : ""),
        },
      },
    },
  };

  const formatDateToMonthDay = (date) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const getLastDates = () => {
    const today = new Date();
    const dates = [];

    if (period === "last_week") {
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - 6); // Start from 6 days ago

      // Generate day names for the last week
      while (lastWeekStart <= today) {
        const dayName = lastWeekStart.toLocaleDateString("en-US", { weekday: "long" });
        dates.push(dayName);
        lastWeekStart.setDate(lastWeekStart.getDate() + 1); // Increment by 1 day
      }
    } else if (period === "last_month") {
      const lastMonthStart = new Date(today);
      lastMonthStart.setMonth(today.getMonth() - 1); // Start from 1 month ago
      lastMonthStart.setDate(lastMonthStart.getDate() + 1);

      // Generate dates for the last month
      while (lastMonthStart <= today) {
        dates.push(formatDateToMonthDay(new Date(lastMonthStart))); // Clone the date to avoid reference issues
        lastMonthStart.setDate(lastMonthStart.getDate() + 1); // Increment by 1 day
      }
    } else {
      throw new Error("Invalid period. Use 'last_week' or 'last_month'.");
    }

    return dates;
  };

  const labels = getLastDates(period);
  const data = new Array(labels.length).fill(0);

  Object.entries(analytics).forEach((value) => {
    const dataDate = new Date(Object.keys((value[1]))[0]);
    const val = period === "last_week"
      ? dataDate.toLocaleDateString("en-US", { weekday: "long" }) : formatDateToMonthDay(dataDate);
    const index = labels.indexOf(val);
    if (index !== -1) data[index] = Object.values(value[1])[0];
  });

  return (
    <Row className="pb-5 mb-5">
      {
        labels.length > 0 && (
          <Line
            options={options}
            data={{
              labels,
              datasets: [
                {
                  data,
                  borderColor: "rgba(106, 200, 99, 1)",
                },
              ],
            }}
            style={{ height: "400px" }}
          />
        )
      }
    </Row>
  );
};

export default LineChart;
