import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
  Card, Col, Container, Form, Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import viewsIcon from "../../assets/images/views.svg";
import savesIcon from "../../assets/images/saves.svg";
import reviewsIcon from "../../assets/images/reviews.svg";
import messagesIcon from "../../assets/images/messages.svg";
import "./Analytics.css";
import {
  analyticsHome, getFavAdsAnalytics, getMessagesAdsAnalytics, getReviewsAdsAnalytics
} from "../redux/Analytics/AnalyticsSlice";
import LineChart from "./LineChart";

function Analytics() {
  const dispatch = useDispatch();
  const {
    vendorAds, totalAdFavourite, totalAdReviews, totalAdMessages, favAdsAnalytics, reviewsAdsAnalytics, messagesAdsAnalytics,
  } = useSelector((state) => state.analytics);

  const [selectedAd, setSelectedAd] = useState("0");
  const [period, setPeriod] = useState("last_month");

  const handleSelectedAd = (e) => {
    e.preventDefault();

    setSelectedAd(e.target.value);
    dispatch(analyticsHome(e.target.value));
  };

  useEffect(() => {
    dispatch(getFavAdsAnalytics({ adId: selectedAd, dateRange: period }));
    dispatch(getReviewsAdsAnalytics({ adId: selectedAd, dateRange: period }));
    dispatch(getMessagesAdsAnalytics({ adId: selectedAd, dateRange: period }));
  }, [selectedAd, period]);

  useEffect(() => {
    dispatch(analyticsHome("0"));
  }, []);

  return (
    <div>
      <div className="profile-settings-banner d-flex align-items-center">
        <div style={{ marginLeft: "100px" }}>
          <div className="roboto-bold-36px-h1">Analytics</div>
          <div className="roboto-regular-18px-body3">
            Your Ads performance overview, at a glance
          </div>
        </div>
      </div>

      <Container
        // fluid
        style={{ marginTop: "100px", marginBottom: "200px" }}
        className=""
      >
        <Row
          className="d-flex mx-0 my-5 py-5"
          // style={{ marginTop: "48px" }}
        >
          <Form.Select
            className="px-5 me-3"
            style={{ width: "fit-content" }}
            size="lg"
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
          <Form.Select
            className="px-5"
            style={{ width: "fit-content" }}
            size="lg"
            defaultValue={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="last_month">Last Month</option>
            <option value="last_week">Last Week</option>
          </Form.Select>
        </Row>

        {/* <Row className="d-flex justify-content-center align-items-center"> */}
        <Row>
          <Col md={11} lg={12} xl={12}>
            <Row className="mb-5 d-flex justify-content-center align-items-center">
              <Col md={3} className="mb-3">
                <Card
                  // style={{ maxWidth: "256px" }}
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
              <Col md={3} className="mb-3">
                <Card
                  // style={{ maxWidth: "256px" }}
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
              <Col md={3} className="mb-3">
                <Card
                  // style={{ maxWidth: "256px" }}
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
              <Col md={3} className="mb-3">
                <Card
                  // style={{ maxWidth: "256px" }}
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
        <h4 className="pt-5 pb-5 text-center">Favourite Ads Analytics</h4>
        <LineChart period={period} analytics={favAdsAnalytics} />
        <h4 className="pt-5 pb-5 text-center">Ad Reviews Analytics</h4>
        <LineChart period={period} analytics={reviewsAdsAnalytics} />
        <h4 className="pt-5 pb-5 text-center">Ad Messages Analytics</h4>
        <LineChart period={period} analytics={messagesAdsAnalytics} />
      </Container>
    </div>
  );
}

export default Analytics;
