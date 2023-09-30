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
import { analyticsHome } from "../redux/Analytics/AnalyticsSlice";
import LineChart from "./LineChart";

function Analytics() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    vendorAds, totalAdFavourite, totalAdReviews, totalAdMessages,
  } = useSelector((state) => state.analytics);

  const [selectedAd, setSelectedAd] = useState("0");

  const handleSelectedAd = (e) => {
    e.preventDefault();

    setSelectedAd(e.target.value);
    dispatch(analyticsHome(e.target.value));
  };

  useEffect(() => {
    dispatch(analyticsHome("0"));
  }, []);

  return (
    <div>
      <Header />
      <TabNavigation role={user?.role} />
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
          className="px-5"
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
        <LineChart label="Favourite Ads Analytics" selectedAd={selectedAd} />
        <LineChart label="Ad Reviews Analytics" selectedAd={selectedAd} />
        <LineChart label="Ad Messages Analytics" selectedAd={selectedAd} />
      </Container>

      <Footer />
    </div>
  );
}

export default Analytics;
