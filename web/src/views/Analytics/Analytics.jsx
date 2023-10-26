import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
  Button,
  Card, Col, Container, Form, Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import viewsIcon from "../../assets/images/views.svg";
import savesIcon from "../../assets/images/saves.svg";
import reviewsIcon from "../../assets/images/reviews.svg";
import messagesIcon from "../../assets/images/messages.svg";
import "./Analytics.css";
import { analyticsHome } from "../redux/Analytics/AnalyticsSlice";
import LineChart from "./LineChart";
import { getVendorAdNames } from "../redux/Posts/AdsSlice";

function Analytics() {
  const dispatch = useDispatch();
  const {
    totalAdFavourite, totalAdReviews, totalAdMessages, favAdsAnalytics, reviewsAdsAnalytics, messagesAdsAnalytics,
  } = useSelector((state) => state.analytics);
  const vendorAdNames = useSelector((state) => state.Ads.vendorAdNames);

  const [selectedAd, setSelectedAd] = useState("0");
  const [period, setPeriod] = useState("last_month");

  useEffect(() => {
    dispatch(getVendorAdNames());
    dispatch(analyticsHome({ adId: selectedAd, period }));
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
        style={{ marginTop: "100px", marginBottom: "200px" }}
      >
        <Row
          className="d-flex justify-content-between align-items-center mx-0 my-5 py-5"
        >
          <div className="d-flex px-0 w-auto">
            <Form.Select
              className="px-4 me-3"
              style={{
                width: "fit-content", height: "56px", fontSize: "16px", color: "#797979",
              }}
              defaultValue={selectedAd}
              onChange={(e) => setSelectedAd(e.target.value)}
            >
              <option value="0">Select Ad</option>
              {
                vendorAdNames.map((ad) => (
                  <option value={ad.id}>{ad.name}</option>
                ))
              }
            </Form.Select>
            <Form.Select
              className="ps-4 pe-5"
              style={{
                width: "fit-content", height: "56px", fontSize: "16px", color: "#797979",
              }}
              defaultValue={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="last_month">Last Month</option>
              <option value="last_week">Last Week</option>
            </Form.Select>
          </div>
          <Button
            variant="success"
            type="submit"
            className="roboto-semi-bold-16px-information btn btn-height w-auto"
            onClick={() => dispatch(analyticsHome({ adId: selectedAd, period }))}
          >
            Search
          </Button>
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
