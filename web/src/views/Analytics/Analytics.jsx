import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
  Card, Col, Container, Form, Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Navbar/Navbar";
import viewsIcon from "../../assets/images/views.svg";
import savesIcon from "../../assets/images/saves.svg";
import reviewsIcon from "../../assets/images/reviews.svg";
import messagesIcon from "../../assets/images/messages.svg";
import "./Analytics.css";
import Footer from "../../components/Footer/Footer";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import { analyticsHome, getFavAdsAnalytics, getMessagesAdsAnalytics, getReviewsAdsAnalytics, handlePeriod } from "../redux/Analytics/AnalyticsSlice";
import LineChart from "./LineChart";

function Analytics() {
  const dispatch = useDispatch();
  const {
    vendorAds, totalAdFavourite, totalAdReviews, totalAdMessages, favAdsAnalytics, reviewsAdsAnalytics, messagesAdsAnalytics, period,
  } = useSelector((state) => state.analytics);

  const initialData = { labels: [], data: [] };

  const [selectedAd, setSelectedAd] = useState("0");
  const [favChartData, setFavChartData] = useState(initialData);
  const [reviewsChartData, setReviewsChartData] = useState(initialData);
  const [messagesChartData, setMessagesChartData] = useState(initialData);

  const handleSelectedAd = (e) => {
    e.preventDefault();

    setSelectedAd(e.target.value);
    dispatch(analyticsHome(e.target.value));
    dispatch(getFavAdsAnalytics({ adId: e.target.value, dateRange: period }));
    dispatch(getReviewsAdsAnalytics({ adId: e.target.value, dateRange: period }));
    dispatch(getMessagesAdsAnalytics({ adId: e.target.value, dateRange: period }));
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

  useEffect(() => {
    dispatch(analyticsHome("0"));
    dispatch(getFavAdsAnalytics({ adId: "0", dateRange: period }));
    dispatch(getReviewsAdsAnalytics({ adId: "0", dateRange: period }));
    dispatch(getMessagesAdsAnalytics({ adId: "0", dateRange: period }));
  }, []);

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
    setFavChartData(getChartData(favAdsAnalytics, labels, data));
  }, [favAdsAnalytics, period]);

  useEffect(() => {
    setReviewsChartData(getChartData(reviewsAdsAnalytics, labels, data));
  }, [reviewsAdsAnalytics, period]);

  useEffect(() => {
    setMessagesChartData(getChartData(messagesAdsAnalytics, labels, data));
  }, [messagesAdsAnalytics, period]);

  return (
    <div>
      <Header />
      <TabNavigation />
      <div className="profile-settings-banner d-flex align-items-center">
        <div style={{ marginLeft: "100px" }}>
          <div className="roboto-bold-36px-h1">Analytics</div>
          <div className="roboto-regular-18px-body3">
            Your Ads performance overview, at a glance
          </div>
        </div>
      </div>

      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "48px" }}
      >
        <Form.Select
          style={{ width: "fit-content" }}
          defaultValue={selectedAd}
          onChange={handleSelectedAd}
        >
          <option value="0">All ads</option>
          {
            vendorAds.map((ad) => (
              <option value={ad.id}>{ad.name}</option>
            ))
          }
        </Form.Select>
      </div>

      <Container
        // fluid
        style={{ marginTop: "100px", marginBottom: "200px" }}
        className=""
      >
        {/* <Row className="d-flex justify-content-center align-items-center"> */}
        <Row>
          <Col md={11} lg={12} xl={12}>
            <Row className="mb-5 d-flex justify-content-center align-items-center">
              <Col md={3}>
                <Card
                  style={{ maxWidth: "256px" }}
                  className="custom-card-analytics"
                >
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgb(234,121,186,0.1)",
                          borderRadius: "50%",
                          marginRight: "16px",
                        }}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <img
                          src={viewsIcon}
                          alt="personalInfo"
                          className="mb-4"
                          style={{ marginTop: "24px" }}
                        />
                      </div>

                      <div>Total Views</div>
                    </div>
                    <Card.Text
                      className="roboto-bold-36px-h1"
                      style={{
                        marginTop: "36px",
                        fontSize: "40px",
                        fontWeight: "400",
                        marginBottom: "8px",
                      }}
                    >
                      347
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card
                  style={{ maxWidth: "256px" }}
                  className="custom-card-analytics"
                >
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgb(234,121,186,0.1)",
                          borderRadius: "50%",
                          marginRight: "16px",
                        }}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <img
                          src={savesIcon}
                          alt="personalInfo"
                          className="mb-4"
                          style={{ marginTop: "24px" }}
                        />
                      </div>

                      <div>Total Saves</div>
                    </div>
                    {/* <Card.Title>Company Information</Card.Title> */}
                    <Card.Text
                      className="roboto-bold-36px-h1"
                      style={{
                        marginTop: "36px",
                        fontSize: "40px",
                        fontWeight: "400",
                        marginBottom: "8px",
                      }}
                    >
                      {totalAdFavourite}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              {/* <Row> */}
              <Col md={3}>
                <Card
                  style={{ maxWidth: "256px" }}
                  className="custom-card-analytics"
                >
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgb(234,121,186,0.1)",
                          borderRadius: "50%",
                          marginRight: "16px",
                        }}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <img
                          src={reviewsIcon}
                          alt="personalInfo"
                          className="mb-4"
                          style={{ marginTop: "24px" }}
                        />
                      </div>

                      <div>Total Reviews</div>
                    </div>
                    <Card.Text
                      className="roboto-bold-36px-h1"
                      style={{
                        marginTop: "36px",
                        fontSize: "40px",
                        fontWeight: "400",
                        marginBottom: "8px",
                      }}
                    >
                      {totalAdReviews}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card
                  style={{ maxWidth: "256px" }}
                  className="custom-card-analytics"
                >
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgb(234,121,186,0.1)",
                          borderRadius: "50%",
                          marginRight: "16px",
                        }}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <img
                          src={messagesIcon}
                          alt="personalInfo"
                          className="mb-4"
                          style={{ marginTop: "24px" }}
                        />
                      </div>

                      <div>Total Messages</div>
                    </div>
                    <Card.Text
                      className="roboto-bold-36px-h1"
                      style={{
                        marginTop: "36px",
                        fontSize: "40px",
                        fontWeight: "400",
                        marginBottom: "8px",
                      }}
                    >
                      {totalAdMessages}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="w-100 d-flex justify-content-end">
          {/* <p className="me-2 my-auto">Period: </p> */}
          <Form.Select
            style={{ width: "fit-content" }}
            defaultValue={period}
            onChange={(e) => dispatch(handlePeriod(e.target.value))}
          >
            <option value="last_month">Last Month</option>
            <option value="last_week">Last Week</option>
          </Form.Select>
        </div>
        {
          favChartData.labels.length > 0 && (
            <LineChart chartData={favChartData} label="Favourite Ads Analytics" period={period} />
          )
        }
        {
          reviewsChartData.labels.length > 0 && (
            <LineChart chartData={reviewsChartData} label="Ad Reviews Analytics" period={period} />
          )
        }
        {
          messagesChartData.labels.length > 0 && (
            <LineChart chartData={messagesChartData} label="Ad Messages Analytics" period={period} />
          )
        }
      </Container>

      <Footer />
    </div>
  );
}

export default Analytics;
