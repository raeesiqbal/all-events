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
import { Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getFavAdsAnalytics, getMessagesAdsAnalytics, getReviewsAdsAnalytics } from "../redux/Analytics/AnalyticsSlice";

const LineChart = ({ label, selectedAd }) => {
  const dispatch = useDispatch();
  const {
    favAdsAnalytics, reviewsAdsAnalytics, messagesAdsAnalytics,
  } = useSelector((state) => state.analytics);

  const initialData = { labels: [], data: [] };

  const [period, setPeriod] = useState("last_month");
  const [chartData, setChartData] = useState(initialData);

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

  const getChartData = (analytics, l, d) => {
    Object.entries(analytics).forEach((value) => {
      const dataDate = new Date(Object.keys((value[1]))[0]);
      const val = period === "last_week"
        ? dataDate.toLocaleDateString("en-US", { weekday: "long" }) : formatDateToMonthDay(dataDate);
      const index = l.indexOf(val);
      if (index !== -1) d[index] = Object.values(value[1])[0];
    });

    return { labels, data };
  };

  useEffect(() => {
    if (label === "Favourite Ads Analytics") dispatch(getFavAdsAnalytics({ adId: selectedAd, dateRange: period }));
    if (label === "Ad Reviews Analytics") dispatch(getReviewsAdsAnalytics({ adId: selectedAd, dateRange: period }));
    if (label === "Ad Messages Analytics") dispatch(getMessagesAdsAnalytics({ adId: selectedAd, dateRange: period }));
  }, [label, period]);

  useEffect(() => {
    let analytics = [];
    if (label === "Favourite Ads Analytics") analytics = favAdsAnalytics;
    if (label === "Ad Reviews Analytics") analytics = reviewsAdsAnalytics;
    if (label === "Ad Messages Analytics") analytics = messagesAdsAnalytics;

    setChartData(getChartData(analytics, labels, data));
  }, [favAdsAnalytics, reviewsAdsAnalytics, messagesAdsAnalytics]);

  return (
    <>
      <div className="w-100 d-md-flex justify-content-between text-center my-5 pt-5 pb-4">
        <h4 className="me-2 my-auto py-3">{label}</h4>
        <div className="text-center">
          <Form.Select
            className="px-5"
            size="lg"
            defaultValue={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="last_month">Last Month</option>
            <option value="last_week">Last Week</option>
          </Form.Select>
        </div>
      </div>
      <Row className="pb-5 mb-5">
        {
          chartData.labels.length > 0 && (
            <Line
              options={options}
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    data: chartData.data,
                    borderColor: "rgba(106, 200, 99, 1)",
                  },
                ],
              }}
              style={{ height: "400px" }}
            />
          )
        }
      </Row>
    </>
  );
};

export default LineChart;
